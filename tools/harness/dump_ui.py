#!/usr/bin/env python3
"""
UI hierarchy dump and semantic tree inspector for Android/Waydroid.
Parses uiautomator XML and dumpsys window to give text/component visibility.
"""

import argparse
import subprocess
import sys
import xml.etree.ElementTree as ET

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

def get_focused_window(device):
    try:
        res = subprocess.run(
            ["adb", "-s", device, "shell", "dumpsys window | grep -i 'mCurrentFocus'"],
            capture_output=True,
            text=True
        )
        return res.stdout.strip()
    except Exception:
        return "Unknown"

def dump_ui(device=None, all_nodes=False):
    if not device:
        device = get_default_device()

    focused = get_focused_window(device)
    print(f"📱 Focus: {focused}")

    remote_xml = "/data/local/tmp/uidump.xml"
    subprocess.run(["adb", "-s", device, "shell", "uiautomator", "dump", "--compressed", remote_xml], capture_output=True)
    
    xml_proc = subprocess.run(["adb", "-s", device, "shell", "cat", remote_xml], capture_output=True, text=True)
    xml_content = xml_proc.stdout.strip()

    if not xml_content or "<hierarchy" not in xml_content:
        print("❌ Failed to obtain UI hierarchy XML from device.", file=sys.stderr)
        return

    # Strip any warnings prior to <?xml
    idx = xml_content.find("<?xml")
    if idx != -1:
        xml_content = xml_content[idx:]

    try:
        root = ET.fromstring(xml_content)
    except Exception as e:
        print(f"❌ Error parsing XML: {e}", file=sys.stderr)
        return

    print("\n🌲 Visual & Interactive UI Tree:")
    print("--------------------------------")

    def walk(node, depth=0):
        cls = node.attrib.get("class", "").split(".")[-1]
        text = node.attrib.get("text", "")
        desc = node.attrib.get("content-desc", "")
        res_id = node.attrib.get("resource-id", "")
        clickable = node.attrib.get("clickable", "false") == "true"
        bounds = node.attrib.get("bounds", "")
        pkg = node.attrib.get("package", "")

        interesting = text or desc or clickable or (all_nodes and cls)

        if interesting:
            indent = "  " * depth
            parts = [f"<{cls}"]
            if res_id:
                parts.append(f"id='{res_id.split('/')[-1]}'")
            if text:
                parts.append(f"text={repr(text)}")
            if desc:
                parts.append(f"desc={repr(desc)}")
            if clickable:
                parts.append("[CLICKABLE]")
            parts.append(f"bounds={bounds}")
            print(f"{indent}{' '.join(parts)} />")

        for child in node:
            walk(child, depth + (1 if interesting else 0))

    walk(root)
    print("--------------------------------\n")

def main():
    parser = argparse.ArgumentParser(description="Inspect Android screen UI hierarchy")
    parser.add_argument("--device", "-s", default=None, help="Specific adb device serial")
    parser.add_argument("--all", "-a", action="store_true", help="Print all layout containers, not just text/interactive elements")
    args = parser.parse_args()

    dump_ui(args.device, args.all)

if __name__ == "__main__":
    main()
