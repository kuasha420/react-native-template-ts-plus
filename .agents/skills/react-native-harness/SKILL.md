---
name: react-native-harness
description: >-
  Manage, run, test, and inspect React Native applications on Linux and Android/Waydroid.
  Use when starting or stopping Metro, verifying UI, capturing screenshots, inspecting accessibility trees,
  running Maestro E2E flows, or debugging the Hermes runtime.
---

# React Native Development Harness & Verification Skill

This skill provides deterministic commands and workflows for developing, inspecting, and testing modern React Native applications on Linux with Waydroid.

## Quick CLI Reference

All interactions are orchestrated through `./tools/harness/dev.sh`:

| Command | Action | Description |
| :--- | :--- | :--- |
| `./tools/harness/dev.sh ensure` | Atomic Up | Checks device, launches Metro detached in background, sets reverse ports, focuses app (<2s) |
| `./tools/harness/dev.sh teardown` | Atomic Down | Stops app, cleanly terminates Metro process, clears reverse ports |
| `./tools/harness/dev.sh status` | Status | Checks Metro health, connected devices, and active window focus |
| `./tools/harness/dev.sh reload` | Fast Reload | Sends HTTP reload to Metro (`/reload`) and triggers Android `rr` keyevent |
| `./tools/harness/dev.sh ui` | Semantic Tree | Dumps accessibility hierarchy via uiautomator XML (safe for LLM context) |
| `./tools/harness/dev.sh screenshot [path]` | Screenshot | Captures window, auto-crops Waydroid freeform borders, saves PNG |
| `./tools/harness/dev.sh flow [path]` | Maestro E2E | Executes declarative Maestro end-to-end automation flow |
| `./tools/harness/dev.sh hierarchy` | Maestro Tree | Dumps Maestro accessibility hierarchy JSON |
| `./tools/harness/dev.sh logs` | Logcat | Streams filtered React Native and Hermes runtime logs |
| `./tools/harness/dev.sh test` | Unit Tests | Runs TypeScript type-check, ESLint, and Jest unit tests |
| `./tools/harness/dev.sh build` | Rebuild APK | Compiles and installs debug APK using Java 17 |

---

## 1. Zero Background Tasks & Metro Management

### Why Detached Daemon?
Running Metro via agent `run_command` with `IsDaemon: true` registers persistent tasks in the agent session. This clutters the session, creates notification spam, and locks port 8081.

### Recommended Pattern
Always use `dev.sh ensure` at the start of a testing session, and `dev.sh teardown` when done.

```bash
# Bring up device, Metro, and app in 1 step:
./tools/harness/dev.sh ensure

# Check Metro status or logs:
./tools/harness/dev.sh metro status
./tools/harness/dev.sh metro logs -n 30

# Clean shutdown:
./tools/harness/dev.sh teardown
```

### Manual Metro CLI Command
When starting Metro via custom scripts, always enforce:
```bash
(cd template && setsid yarn react-native start --port 8081 --no-interactive > /tmp/react-native-metro.log 2>&1 < /dev/null &)
```
- Must run in `template/` (where `@react-native-community/cli` is installed).
- Must include `--no-interactive < /dev/null` to prevent Node key-listener deadlocks.

---

## 2. Safe UI Inspection & Visual Verification

### Absolute Rule: Never `view_file` on Binary Files
Invoking `view_file` on `.png`, `.jpg`, `.apk`, or binary payloads immediately breaks the model context generator (`content_len: 0`) and permanently freezes the agent session.

### Semantic Inspection (Agent Workflow)
To understand what is currently on the screen:
```bash
./tools/harness/dev.sh ui
```
This parses `uiautomator dump` XML and displays text labels, buttons, test IDs, and bounding coordinates in plaintext.

### Visual Screenshot Capture (User Walkthroughs)
To capture a screenshot for the user:
```bash
./tools/harness/dev.sh screenshot /tmp/screen.png
```
- Automatically queries `dumpsys window displays` for Waydroid freeform window bounds (`bounds=[x1,y1][x2,y2]`).
- Auto-crops black letterboxing and desktop background.
- Embed in artifacts using Markdown: `![Screen Title](/path/to/screenshot.png)`.

---

## 3. Automated End-to-End Testing (Maestro)

Maestro is installed at `~/.maestro/bin/maestro` and uses Java 17 (`JAVA_HOME=/usr/lib/jvm/zulu-17`).

### Running Tests
```bash
./tools/harness/dev.sh flow tools/harness/smoke_flow.yaml
```

### Writing a Flow (`.yaml`)
```yaml
appId: com.helloworld
---
- launchApp
- tapOn:
    id: "icon-button"
- tapOn: "Bottom Tab"
- tapOn: "Go to Details Page"
- assertVisible: "Bottom Tab Details Screen"
- tapOn: "Go to Home Page"
- assertVisible: "Bottom Tab Home Screen"
```

---

## 4. Hermes Runtime Debugging (CDP)

Directly evaluate JavaScript in the live app runtime via Chrome DevTools Protocol WebSocket:

```bash
# Metro inspector requires Origin header to avoid 401 Unauthorized
node tools/harness/cdp.js "typeof React"
node tools/harness/cdp.js "document.title || navigator.userAgent"
```

---

## 5. Troubleshooting Runbooks

### Port 8081 Conflict / EADDRINUSE
```bash
./tools/harness/dev.sh metro stop
fuser -k -9 8081/tcp 2>/dev/null || true
./tools/harness/dev.sh metro start
```

### Waydroid Device Not Found
```bash
# Check Waydroid status
waydroid status
# If not running:
# waydroid session start &
# Reconnect ADB:
adb connect 192.168.240.112:5555
./tools/harness/dev.sh connect
```

### Bundle Not Loading on App (Red screen / Network error)
```bash
# Ensure reverse port forwarding is active:
adb reverse tcp:8081 tcp:8081
# Verify Metro is responding:
curl -s http://localhost:8081/status
# Trigger bundle reload:
./tools/harness/dev.sh reload
```
