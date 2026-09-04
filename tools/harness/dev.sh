#!/usr/bin/env bash
# react-native-template-ts-plus DX Developer CLI
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

function usage() {
    cat <<EOF
Usage: ./tools/harness/dev.sh <command> [args]

Commands:
  up | ensure   Atomically ensure device connected, Metro bundler running, reverse port active, and app launched
  down | teardown  Atomically stop Metro bundler, reverse proxy, and optionally stop app
  metro         Manage Metro bundler lifecycle: dev.sh metro {start|stop|restart|status|logs|ensure}
  connect       Connect to Waydroid / emulator and configure reverse port forwarding
  status        Check Metro bundler, connected devices, and active app focus
  screenshot    Safely capture a screenshot (e.g. dev.sh screenshot /tmp/screen.png)
  ui            Dump and parse visual UI hierarchy tree (semantic screen state)
  reload        Reload the React Native app bundle
  menu          Trigger React Native Dev Menu (Shake / Keyevent 82)
  start         Start Metro bundler (background daemon)
  stop          Stop Metro bundler
  test          Run full verification suite (TypeScript, ESLint, Jest)
  build         Build and install debug APK onto connected device
  logs          Tail or view filtered React Native logcat logs
  flow          Run a Maestro end-to-end flow (e.g. dev.sh flow tools/harness/smoke_flow.yaml)
  hierarchy     Output full Maestro accessibility hierarchy JSON
EOF
}

CMD="${1:-help}"
shift || true

case "$CMD" in
    up|ensure)
        echo "=== Ensuring React Native Environment is Ready ==="
        "$SCRIPT_DIR/device.sh"
        "$SCRIPT_DIR/metro.sh" ensure
        echo "Ensuring app is running..."
        CURRENT_FOCUS=$(adb shell "dumpsys window | grep -i 'mCurrentFocus'" 2>/dev/null || true)
        if [[ "$CURRENT_FOCUS" != *"com.helloworld"* ]]; then
            echo "Launching com.helloworld/.MainActivity..."
            adb shell am start -n com.helloworld/.MainActivity
            sleep 2
        else
            echo "App com.helloworld is already in focus."
        fi
        echo "✅ React Native environment is active and ready."
        ;;
    down|teardown)
        echo "=== Tearing Down React Native Environment ==="
        echo "Stopping com.helloworld..."
        adb shell am force-stop com.helloworld 2>/dev/null || true
        "$SCRIPT_DIR/metro.sh" stop
        echo "Clearing adb reverse ports..."
        adb reverse --remove-all 2>/dev/null || true
        echo "✅ React Native environment torn down."
        ;;
    metro)
        "$SCRIPT_DIR/metro.sh" "$@"
        ;;
    connect)
        "$SCRIPT_DIR/device.sh"
        ;;
    status)
        echo "=== Environment Status ==="
        "$SCRIPT_DIR/metro.sh" status || true
        echo "- Connected Devices:"
        adb devices -l
        echo "- Active Focus:"
        adb shell "dumpsys window | grep -i 'mCurrentFocus'" 2>/dev/null || echo "  Unable to retrieve window focus"
        ;;
    screenshot)
        python3 "$SCRIPT_DIR/capture.py" "$@"
        ;;
    ui)
        python3 "$SCRIPT_DIR/dump_ui.py" "$@"
        ;;
    reload)
        echo "Reloading React Native app..."
        curl -s -X POST http://localhost:8081/reload >/dev/null 2>&1 || true
        adb shell input text "rr" 2>/dev/null || adb shell input keyevent 82
        echo "Reload signal sent."
        ;;
    menu)
        echo "Opening Dev Menu..."
        adb shell input keyevent 82
        ;;
    start)
        "$SCRIPT_DIR/metro.sh" start
        ;;
    stop)
        "$SCRIPT_DIR/metro.sh" stop
        ;;
    test)
        echo "Running verification suite..."
        (cd "$ROOT_DIR/template" && yarn type-check && yarn lint && yarn test)
        ;;
    build)
        echo "Building and installing debug app..."
        (cd "$ROOT_DIR/template/android" && JAVA_HOME=/usr/lib/jvm/zulu-17 ./gradlew installDebug)
        "$SCRIPT_DIR/device.sh"
        ;;
    logs)
        python3 "$SCRIPT_DIR/rn_logger.py" "$@"
        ;;
    flow)
        echo "Running Maestro flow..."
        export JAVA_HOME=/usr/lib/jvm/zulu-17
        export PATH="/usr/lib/jvm/zulu-17/bin:$HOME/.maestro/bin:$PATH"
        DEVICE=$(adb devices | grep -w "device" | head -n 1 | awk '{print $1}')
        maestro ${DEVICE:+--device "$DEVICE"} test "${1:-$SCRIPT_DIR/smoke_flow.yaml}"
        ;;
    hierarchy)
        export JAVA_HOME=/usr/lib/jvm/zulu-17
        export PATH="/usr/lib/jvm/zulu-17/bin:$HOME/.maestro/bin:$PATH"
        DEVICE=$(adb devices | grep -w "device" | head -n 1 | awk '{print $1}')
        maestro ${DEVICE:+--device "$DEVICE"} hierarchy
        ;;
    *)
        usage
        ;;
esac
