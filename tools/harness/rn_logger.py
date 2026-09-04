#!/usr/bin/env python3
"""
React Native logcat streaming and filtering utility.
Filters adb logcat to isolate React Native JS logs, runtime errors, and crashes.
"""

import argparse
import re
import subprocess
import sys

TAG_FILTERS = [
    "ReactNative",
    "ReactNativeJS",
    "AndroidRuntime",
    "Hermes",
    "SoLoader",
    "unknown:ReactNative",
]

def get_default_device():
    res = subprocess.run(["adb", "devices"], capture_output=True, text=True)
    devices = [
        line.split()[0]
        for line in res.stdout.strip().splitlines()[1:]
        if line.strip() and "\tdevice" in line
    ]
    if not devices:
        print("Error: No adb devices attached.", file=sys.stderr)
        sys.exit(1)
    return devices[0]

def tail_logs(lines_count=100, device=None, follow=False):
    if not device:
        device = get_default_device()

    cmd = ["adb", "-s", device, "logcat", "-d" if not follow else ""]
    if not follow:
        cmd += ["-t", str(lines_count)]
    cmd = [c for c in cmd if c]

    try:
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        for line in proc.stdout:
            # Check for interesting keywords or tags
            if any(tag in line for tag in TAG_FILTERS) or "com.helloworld" in line or "FATAL" in line or "Exception" in line:
                # Colorize if terminal supports it
                if "FATAL" in line or "AndroidRuntime" in line or " E " in line:
                    print(f"\033[91m{line.strip()}\033[0m")
                elif " W " in line:
                    print(f"\033[93m{line.strip()}\033[0m")
                elif "ReactNativeJS" in line:
                    print(f"\033[96m{line.strip()}\033[0m")
                else:
                    print(line.strip())
        proc.wait()
    except KeyboardInterrupt:
        pass

def main():
    parser = argparse.ArgumentParser(description="Tail and filter React Native logs from Android")
    parser.add_argument("-n", "--lines", type=int, default=150, help="Number of recent log lines to inspect (default: 150)")
    parser.add_argument("-f", "--follow", action="store_true", help="Follow live log stream")
    parser.add_argument("-s", "--device", default=None, help="Specific adb device serial")
    args = parser.parse_args()

    tail_logs(lines_count=args.lines, device=args.device, follow=args.follow)

if __name__ == "__main__":
    main()
