# gh-tagger

A nodejs cli for updating instances of semver versions and creating annotated tags for your github repository.


## Usage

By default tagger will only update the version number in your `package.json`. If you add a `semverPaths` key in your package json with an array of paths, tagger will update those as well. Currently version needs to be at top level so `packageJson.version`.

```bash
tagger <patch|minor|major> [<release message>]
# e.g.
tagger patch "Fixed xyz bug"
```

![Imgur](https://imgur.com/JSNOJZU.gif)

### Automatic Release Deploys

For automatic deploys of your releases you can use a github workflow e.g.

```yml
name: Releases

on: 
  push:
    tags:
    - '*'

jobs:

  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '14'
        registry-url: 'https://registry.npmjs.org'
    - run: npm install
    # - run: npm test
    - run: npm run build
    - run: npm publish
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
    - uses: ncipollo/release-action@v1
      with:
        artifacts: "lib/*, package.json, LICENSE, readme.md"
        bodyFile: "body.md"
        token: ${{ secrets.GITHUB_TOKEN }}
```

> bodyFile is optional. I personally like to copy the most recent version from my CHANGELOG.