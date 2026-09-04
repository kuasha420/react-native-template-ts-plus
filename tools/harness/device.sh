#!/usr/bin/env bash
# Device connection and port forwarding helper for react-native-template-ts-plus
set -euo pipefail

WAYDROID_IP="192.168.240.112:5555"

echo "=== Android Device Detection & Setup ==="

# Check if Waydroid is running
if command -v waydroid &>/dev/null; then
    STATUS=$(waydroid status 2>/dev/null || true)
    if echo "$STATUS" | grep -q "Session:[[:space:]]*RUNNING"; then
        echo "Waydroid session detected running."
        # Attempt connection
        adb connect "$WAYDROID_IP" 2>&1 | grep -E "connected|already connected" || true
    fi
fi

# List connected devices
DEVICES=$(adb devices | grep -w "device" | awk '{print $1}')

if [ -z "$DEVICES" ]; then
    echo "⚠️ No Android device found. Looking for emulators..."
    if command -v emulator &>/dev/null; then
        echo "Available AVDs:"
        emulator -list-avds || true
    fi
    echo "To connect to Waydroid: adb connect $WAYDROID_IP"
    exit 1
fi

echo "Connected devices:"
adb devices -l

# Auto-configure reverse port forwarding for Metro bundler
for DEV in $DEVICES; do
    echo "Configuring adb reverse tcp:8081 for $DEV..."
    adb -s "$DEV" reverse tcp:8081 tcp:8081 || true
done

echo "✅ Device environment ready."
