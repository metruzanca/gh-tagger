export type Label = 'patch'|'minor'|'major'
export type LabelNumber = 0|1|2
export type PackageJson = {
  packageVersion: string;
  semverPaths: string[];
}