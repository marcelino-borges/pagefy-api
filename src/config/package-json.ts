import fs from "fs/promises";
import { log } from "../utils";
import { getLatestVersionFromChangelog } from "./changelog";

const PACKAGE_JSON_PATH = "./package.json";

export const getPackageJson = async () => {
  const str = (await fs.readFile(PACKAGE_JSON_PATH)).toString();
  return JSON.parse(str);
};

const updatePackageJsonVersionFromChangelog = async () => {
  const apiVersion = await getLatestVersionFromChangelog();
  const pkg = await getPackageJson();
  pkg.version = apiVersion;

  await fs.writeFile(PACKAGE_JSON_PATH, JSON.stringify(pkg)).catch((err) => {
    log("Error updating version on package.json:", err);
  });
};

updatePackageJsonVersionFromChangelog();
