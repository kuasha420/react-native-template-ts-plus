#!/usr/bin/env node
/**
 * React Native Chrome DevTools Protocol (CDP) CLI
 * Connects directly to Hermes JS engine via Metro's inspector proxy WebSocket.
 */
const http = require('http');
const path = require('path');
const WebSocket = require(path.join(__dirname, '../../template/node_modules/ws'));

async function getDebuggerUrl(port = 8081) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const targets = JSON.parse(data);
          if (!targets.length) return reject(new Error('No active React Native CDP targets found.'));
          resolve(targets[0].webSocketDebuggerUrl);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function evalInHermes(expr, port = 8081) {
  const wsUrl = await getDebuggerUrl(port);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl, { headers: { Origin: `http://localhost:${port}` } });
    let reqId = 1;

    ws.on('open', () => {
      ws.send(JSON.stringify({ id: reqId, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
    });

    ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.id === reqId) {
        ws.close();
        if (msg.result.exceptionDetails) {
          reject(new Error(msg.result.exceptionDetails.text || 'CDP Evaluation exception'));
        } else {
          resolve(msg.result.result.value);
        }
      }
    });

    ws.on('error', reject);
    setTimeout(() => { ws.close(); reject(new Error('CDP Timeout')); }, 5000);
  });
}

const expr = process.argv.slice(2).join(' ') || '({ time: new Date().toISOString(), hermes: typeof HermesInternal !== "undefined" })';
evalInHermes(expr).then(res => {
  console.log(typeof res === 'object' ? JSON.stringify(res, null, 2) : res);
  process.exit(0);
}).catch(err => {
  console.error('CDP Error:', err.message);
  process.exit(1);
});
