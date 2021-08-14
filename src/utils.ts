import { PackageJson } from "./types"

export async function validatePackageJson(packageJsonPath: string): Promise<PackageJson> {
  const {
    version: packageVersion,
    semverPaths
  } = require(packageJsonPath)
  if(!packageVersion) {
    return {
      packageVersion: '0.0.0',
      semverPaths
    }
  }
  return {
    packageVersion,
    semverPaths,
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
