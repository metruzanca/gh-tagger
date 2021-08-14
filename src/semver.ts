import { Label, LabelNumber } from "./types"

export function parseLabel(label: Label): LabelNumber {
  switch (label) {
    case 'major': return 0
    case 'minor': return 1
    case 'patch': return 2
    default:
      console.error(`Received "${process.argv[2]}" and was expecting one of ["patch", "minor", "major"]`)
      process.exit(1)
  }
}

export function incrementSemver(version: string, label: LabelNumber) {
  const currentVersion = version
    .split('.')
    .map((n:string) => parseInt(n))
  currentVersion[label] = currentVersion[label] + 1
  return currentVersion.join('.')
}