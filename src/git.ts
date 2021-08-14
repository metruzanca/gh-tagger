import execSh from 'exec-sh'
import { capitalize } from './utils'
const exec = execSh.promise

export async function commit(version: string, packageVersion: string) {
  const commitMessage = `Updated version ${packageVersion} => ${version}`
  await exec(`git add . && git commit -m "${commitMessage}"`)
}

export async function createTag(version: string, packageVersion: string, label: string, message: string) {
  message = message ? ` - ${message}` : ''
  const tagMessage = `${capitalize(label)} update: ${packageVersion} => ${version}${message}`
  await exec(`git tag -a ${version} -m "${tagMessage}"`)
  console.log(tagMessage)
}

export async function push() {
  await exec(`git push --follow-tags `)
}