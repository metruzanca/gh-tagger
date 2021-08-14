# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.1] - 2021-08-14
### Fixed
- [Bug] Package.json missing the version fieled now gets 0.0.0 written.

## [0.2.0] - 2021-08-14
### Changed
- Split code up into multiple files to be more organized and modular
- Added a readme
### Fixed
- [Bug] When npm installed, created binary was missing shebang
- [Bug] Package.json missing the version fieled now has it added at 0.0.0 (which gets incremented)
## [0.1.0] - 2021-08-14

### Added
- Added releases workflow, changelog, license, readme.md

### Fixed
- Fixed module resolution for package.json when globally installed or run from npx

## [0.0.0] - 2021-08-14
- Imported code from Gist https://gist.github.com/metruzanca/359e0adb5f9d087ec242f76aad98eb8e