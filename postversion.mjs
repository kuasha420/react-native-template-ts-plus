import { execSync } from "child_process";
import fs from "fs";
import pkgJson from "./package.json" assert { type: "json" };
import templatePkgJson from "./template/package.json" assert { type: "json" };

const versionFilePath = "./template/src/services/version.ts";

fs.copyFileSync(versionFilePath, "./version.mjs");
const { currentVersion } = await import("./version.mjs");
fs.rmSync("./version.mjs");

// Update template version in source code.
execSync(
  `sed -i "s!${currentVersion}!${pkgJson.version}!g" ${versionFilePath}`
);

// Add new version matrix entry in README.md if needed.

const readme = fs.readFileSync("./README.md", "utf8");

const versionRegex =
  /(?<=<!-- start version-matrix -->\s+).*?(?=\s+<!-- end version-matrix -->)/gs;

const match = readme.match(versionRegex);

const versionMatrix = match[0]
  .split("\n")
  .slice(3)
  .map((str) => str.slice(1, -1).replaceAll(" ", "").split("|"));

const reactNativeVersion = templatePkgJson.dependencies["react-native"];
const isAlreadySupported = versionMatrix.some(
  ([rnVersion]) => rnVersion === reactNativeVersion
);

if (!isAlreadySupported) {
  const templateVersionRange = pkgJson.version
    .split(".")
    .slice(0, 2)
    .concat("\\*")
    .join(".");
  versionMatrix.push([reactNativeVersion, templateVersionRange]);

  const markdownHeader = [
    "| React Native | Template |",
    "| ------------ | -------- |",
  ];

  const markdownRows = versionMatrix
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([reactNative, template]) => {
      const leftEmptySpace = " ".repeat(Math.max(0, 12 - reactNative.length));
      const rightEmptySpace = " ".repeat(Math.max(0, 8 - template.length));
      return `| ${reactNative}${leftEmptySpace} | ${template}${rightEmptySpace} |`;
    });

  const markdown = ["", ...markdownHeader, ...markdownRows].join("\n");

  const newReadme = readme.replace(versionRegex, markdown);

  // Write markdown to README.md
  fs.writeFileSync("./README.md", newReadme);
}
