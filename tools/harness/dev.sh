#!/usr/bin/env bash
# react-native-template-ts-plus DX Developer CLI
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

function usage() {
    cat <<EOF
Usage: ./tools/harness/dev.sh <command> [args]

Commands:
  connect       Connect to Waydroid / emulator and configure reverse port forwarding
  status        Check Metro bundler, connected devices, and active app focus
  screenshot    Safely capture a screenshot (e.g. dev.sh screenshot /tmp/screen.png)
  ui            Dump and parse visual UI hierarchy tree (semantic screen state)
  reload        Reload the React Native app bundle
  menu          Trigger React Native Dev Menu (Shake / Keyevent 82)
  start         Start Metro bundler on port 8081
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
    connect)
        "$SCRIPT_DIR/device.sh"
        ;;
    status)
        echo "=== Environment Status ==="
        echo "- Metro Bundler:"
        curl -s http://localhost:8081/status || echo "  Not running"
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
        adb shell input text "rr" || adb shell input keyevent 82
        echo "Done."
        ;;
    menu)
        echo "Opening Dev Menu..."
        adb shell input keyevent 82
        ;;
    start)
        echo "Starting Metro bundler..."
        yarn --cwd "$ROOT_DIR/template" start --port 8081
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
