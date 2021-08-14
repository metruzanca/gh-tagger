import { exists, updateJson } from "./fs"
import { PackageJson } from "./types"

async function getVersion(version: string|undefined, packageJsonPath: string) {
  if (version) {
    return version
  }
  console.warn('Missing version field')
  console.warn('Adding version field set to 0.0.0 in package.json')  
  await updateJson(packageJsonPath, data => {
    data.version = '0.0.0'
    return data
  })
  return require(packageJsonPath).version
}

function getSemverPaths(semverPaths: string[]|undefined, packageJsonPath: string) {
  const paths = [packageJsonPath]
  if (Array.isArray(semverPaths)) {
    paths.push(...semverPaths)
    return paths 
  }
  return paths
}

export async function validatePackageJson(packageJsonPath: string): Promise<PackageJson> {
  if(!await exists(packageJsonPath)) {
    console.error('No package.json at cwd. Please make sure you\'re running this from the same directory as package.json')
    process.exit(1)
  }
  const pj = require(packageJsonPath)

  const packageVersion = await getVersion(pj.version, packageJsonPath)
  const semverPaths = getSemverPaths(pj.semverPaths, packageJsonPath)

  return {
    packageVersion,
    semverPaths,
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
