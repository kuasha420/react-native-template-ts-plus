#!/usr/bin/env python3
"""
Screenshot capture utility for Android/Waydroid in React Native development.
Safely captures screenshots without stdout corruption and automatically crops
to active freeform app window in Waydroid multi-window desktop mode.
"""

import argparse
import os
import re
import subprocess
import sys
import time

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

def get_freeform_window_bounds(device, package="com.helloworld"):
    """Detects active freeform window bounds from dumpsys window displays."""
    try:
        proc = subprocess.run(
            ["adb", "-s", device, "shell", "dumpsys", "window", "displays"],
            capture_output=True,
            text=True
        )
        lines = proc.stdout.splitlines()
        for i, line in enumerate(lines):
            if package in line and "mode=freeform" in line:
                for sub in lines[i:i+4]:
                    m = re.search(r'bounds=\[(\d+),(\d+)\]\[(\d+),(\d+)\]', sub)
                    if m:
                        x1, y1, x2, y2 = map(int, m.groups())
                        return (x1, y1, x2 - x1, y2 - y1)
    except Exception:
        pass
    return None

def capture_screenshot(target_path, device=None, full=False, package="com.helloworld"):
    if not device:
        device = get_default_device()

    target_dir = os.path.dirname(os.path.abspath(target_path))
    os.makedirs(target_dir, exist_ok=True)

    remote_path = f"/sdcard/screen_{int(time.time())}.png"

    # Capture internally on device first to prevent driver stdout pollution
    subprocess.run(["adb", "-s", device, "shell", "screencap", "-p", remote_path], check=True, capture_output=True)
    
    # Pull the clean file to local host
    subprocess.run(["adb", "-s", device, "pull", remote_path, target_path], check=True, capture_output=True)
    
    # Clean up remote file
    subprocess.run(["adb", "-s", device, "shell", "rm", "-f", remote_path], capture_output=True)

    bounds = None if full else get_freeform_window_bounds(device, package)
    if bounds:
        x, y, w, h = bounds
        try:
            subprocess.run(
                ["magick", target_path, "-crop", f"{w}x{h}+{x}+{y}", "+repage", target_path],
                check=True,
                capture_output=True
            )
        except Exception as e:
            print(f"Warning: Could not crop image with ImageMagick: {e}", file=sys.stderr)

    # Inspect image metadata safely via ImageMagick
    info = "Saved successfully"
    try:
        res = subprocess.run(["identify", target_path], capture_output=True, text=True)
        if res.returncode == 0:
            info = res.stdout.strip()
    except Exception:
        pass

    size = os.path.getsize(target_path)
    print(f"✅ Screenshot captured: {target_path}")
    print(f"   Size: {size:,} bytes")
    print(f"   Info: {info}")
    if bounds:
        print(f"   Window Cropped: {bounds[2]}x{bounds[3]} at ({bounds[0]}, {bounds[1]})")
    print(f"   Markdown embed: ![{os.path.basename(target_path)}]({target_path})")

def main():
    parser = argparse.ArgumentParser(description="Safely capture Android device screenshot")
    parser.add_argument("output", nargs="?", default=None, help="Output PNG path")
    parser.add_argument("--device", "-s", default=None, help="Specific adb device serial")
    parser.add_argument("--full", action="store_true", help="Capture full canvas without multi-window cropping")
    parser.add_argument("--package", default="com.helloworld", help="Target package for freeform cropping")
    args = parser.parse_args()

    if not args.output:
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        args.output = f"/tmp/screens/screen_{timestamp}.png"

    capture_screenshot(args.output, args.device, args.full, args.package)

if __name__ == "__main__":
    main()
