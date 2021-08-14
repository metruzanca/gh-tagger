#!/usr/bin/node

import inquirer from 'inquirer'
import chalk from 'chalk'

import { resolve } from 'path'
import { validatePackageJson } from './utils'
import { updateJson } from './fs'
import { Label, LabelNumber } from './types'
import { commit, createTag, push } from './git'
import { incrementSemver, parseLabel } from './semver'

const PROJECT_ROOT = process.cwd()

main()

async function main() {
  const {
    packageVersion,
    semverPaths,
  } = await validatePackageJson(resolve(PROJECT_ROOT, 'package.json'))
  
  const label = process.argv[2] as Label
  const labelNumber = parseLabel(label)
  const releaseMessage = process.argv[3]
  const version = incrementSemver(packageVersion, labelNumber)
  
  const { confirm } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message: `Creating new Git tag for ${packageVersion} => ${colorizeVersion(version, labelNumber)}\nShall I proceed?`
  })

  if (confirm) {
    try {
      console.log(chalk.green('Updating Files...'))
      await updateFiles(semverPaths, version)
  
      console.log(chalk.green('Commiting Files...'))
      await commit(version, packageVersion)
  
      console.log(chalk.green('Creating Release Tag...'))
      await createTag(version, packageVersion, label, releaseMessage)
  
      console.log(chalk.green('Pushing Files & Tag...'))
      await push()
      
      console.log('Release Created and Deploying! 🚀')
    } catch (error) {
      console.error(chalk.red("Something went wrong while attempting to create git tags."))
      console.error("I recommend running\n\ngit status\n\nto find out what happened.")
      console.error("Make sure git is installed in this shell.")
    }
  }
}

function colorizeVersion(version: string, label: LabelNumber) {
  return version
    .split('.')
    .map((n, i) => i === label ? chalk.green(n) : n)
    .join('.')
}

async function updateFiles(filePaths: string[], version: string) {
  try {
    for (const path of filePaths) {
      const resolvedPath = resolve(PROJECT_ROOT, path)
      await updateJson(resolvedPath, data => {
        data.version = version
        return data
      })
    }
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
}
