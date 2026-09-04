#!/usr/bin/env bash
# Metro bundler lifecycle management script
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PID_FILE="/tmp/react-native-metro.pid"
LOG_FILE="/tmp/react-native-metro.log"
PORT=8081

function is_metro_running() {
    local status
    status=$(curl -s -m 2 "http://localhost:${PORT}/status" 2>/dev/null || true)
    if [[ "$status" == *"packager-status:running"* ]]; then
        return 0
    else
        return 1
    fi
}

function configure_reverse_ports() {
    if command -v adb &>/dev/null; then
        local devices
        devices=$(adb devices 2>/dev/null | grep -w "device" | awk '{print $1}' || true)
        for dev in $devices; do
            adb -s "$dev" reverse "tcp:${PORT}" "tcp:${PORT}" 2>/dev/null || true
        done
    fi
}

function start_metro() {
    if is_metro_running; then
        local pid="unknown"
        if [ -f "$PID_FILE" ]; then
            pid=$(cat "$PID_FILE" 2>/dev/null || echo "unknown")
        fi
        echo "Metro bundler is already running on port ${PORT} (PID: $pid)."
        configure_reverse_ports
        return 0
    fi

    echo "Starting Metro bundler in background (port ${PORT})..."
    
    # Check if a non-responsive process is occupying the port
    local port_pids
    port_pids=$(lsof -ti:"${PORT}" 2>/dev/null || true)
    if [ -n "$port_pids" ]; then
        for pid in $port_pids; do
            local cmd
            cmd=$(ps -p "$pid" -o comm= 2>/dev/null || true)
            if [[ "$cmd" == *"node"* ]]; then
                echo "Terminating stale node process on port ${PORT} (PID: $pid)..."
                kill -9 "$pid" 2>/dev/null || true
            fi
        done
        sleep 1
    fi

    # Launch detached Metro process via setsid inside template directory
    (
        cd "$ROOT_DIR/template"
        setsid yarn react-native start --port "$PORT" --no-interactive > "$LOG_FILE" 2>&1 < /dev/null &
        echo $! > "$PID_FILE"
    )
    local new_pid
    new_pid=$(cat "$PID_FILE" 2>/dev/null || echo "unknown")

    echo "Waiting for Metro bundler to become ready..."
    local attempts=0
    local max_attempts=30
    while [ $attempts -lt $max_attempts ]; do
        if is_metro_running; then
            echo "✅ Metro bundler ready on http://localhost:${PORT} (PID: $new_pid)."
            configure_reverse_ports
            return 0
        fi
        sleep 0.5
        attempts=$((attempts + 1))
    done

    echo "❌ Metro bundler failed to start within 15 seconds. Check logs: $LOG_FILE"
    if [ -f "$LOG_FILE" ]; then
        echo "--- Last 20 lines of $LOG_FILE ---"
        tail -n 20 "$LOG_FILE"
    fi
    return 1
}

function stop_metro() {
    echo "Stopping Metro bundler..."

    if [ -f "$PID_FILE" ]; then
        local pid
        pid=$(cat "$PID_FILE" 2>/dev/null || true)
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
            sleep 0.5
            if kill -0 "$pid" 2>/dev/null; then
                kill -9 "$pid" 2>/dev/null || true
            fi
        fi
        rm -f "$PID_FILE"
    fi

    # Clean up any leftover node process on port
    local port_pids
    port_pids=$(lsof -ti:"${PORT}" 2>/dev/null || true)
    if [ -n "$port_pids" ]; then
        for p in $port_pids; do
            local cmd
            cmd=$(ps -p "$p" -o comm= 2>/dev/null || true)
            if [[ "$cmd" == *"node"* ]]; then
                kill -9 "$p" 2>/dev/null || true
            fi
        done
    fi

    if ! is_metro_running; then
        echo "✅ Metro bundler stopped."
    else
        echo "⚠️ Metro bundler process could not be terminated."
        return 1
    fi
}

function status_metro() {
    if is_metro_running; then
        local pid="unknown"
        if [ -f "$PID_FILE" ]; then
            pid=$(cat "$PID_FILE" 2>/dev/null || echo "unknown")
        else
            for p in $(lsof -ti:"${PORT}" 2>/dev/null || true); do
                local cmd
                cmd=$(ps -p "$p" -o comm= 2>/dev/null || true)
                if [[ "$cmd" == *"node"* ]]; then
                    pid="$p"
                    echo "$pid" > "$PID_FILE"
                    break
                fi
            done
        fi
        echo "Metro bundler: RUNNING on port ${PORT} (PID: $pid)"
        return 0
    else
        echo "Metro bundler: NOT RUNNING"
        return 1
    fi
}

function logs_metro() {
    if [ ! -f "$LOG_FILE" ]; then
        echo "No log file found at $LOG_FILE"
        return 1
    fi
    if [ "$#" -gt 0 ]; then
        tail "$@" "$LOG_FILE"
    else
        tail -n 50 "$LOG_FILE"
    fi
}

function ensure_metro() {
    if ! is_metro_running; then
        start_metro
    else
        local pid="unknown"
        if [ -f "$PID_FILE" ]; then
            pid=$(cat "$PID_FILE" 2>/dev/null || echo "unknown")
        fi
        echo "Metro bundler is running and healthy on port ${PORT} (PID: $pid)."
        configure_reverse_ports
    fi
}

CMD="${1:-status}"
shift || true

case "$CMD" in
    start)
        start_metro
        ;;
    stop)
        stop_metro
        ;;
    restart)
        stop_metro
        sleep 1
        start_metro
        ;;
    status)
        status_metro
        ;;
    ensure)
        ensure_metro
        ;;
    logs)
        logs_metro "$@"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|ensure|logs}"
        exit 1
        ;;
esac
