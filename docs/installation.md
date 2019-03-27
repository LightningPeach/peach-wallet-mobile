# Installation guide

## Prerequisites

- A Mac is required to build project for iOS
- [Chocolatey](https://chocolatey.org/) package manager is recommended for Windows platform 
- nodejs 8 or 10 ([realmjs](https://github.com/realm/realm-js/issues/2149) doesn't support node 11 yet)
- install yarn (recommended)
  ```bash
  MacOS: brew install yarn
  Windows: choco install yarn
  ```
- install [react-native deps](https://facebook.github.io/react-native/docs/getting-started.html)
  ```bash
  MacOS: brew install watchman
  Windows: choco install watchman
  npm install -g react-native-cli
  ```
- install [android sdk + ndk(r17c)](https://facebook.github.io/react-native/docs/building-from-source)
- install [Xcode and command line tools](https://facebook.github.io/react-native/docs/getting-started.html#xcode)
- install [CocoaPods](https://cocoapods.org)

## App installation

1. git clone this repo:

2. cd to the cloned repo:

3. install dependencies with `yarn` (recommended) or `npm i`

4. cd to `ios` folder and run `pod install` (for iOS)

## How to Run App

1.  cd to the repo
2.  run app

- for iOS
  - run `yarn 7` for run on iPhone 7 simulator
  - run `yarn x` for run on iPhone X simulator
  - run `yarn se` for run on iPhone SE simulator
- for Android
  - Run android emulator
    - use [AVD manager](https://developer.android.com/studio/run/managing-avds)
    - use [Genymotion](https://www.genymotion.com/desktop/)
  - run `yarn android`

## How to build release binaries

- for iOS

  - configure [code signing](https://help.apple.com/xcode/mac/current/#/dev3a05256b8) in Xcode
  - open `ios/LightningMobileApp.xcworkspace` in Xcode
  - select `Generic iOS Device` as device
  - run Product -> Archive
  - upload to Apple Store

- for Android
  - [generate a signing key](https://facebook.github.io/react-native/docs/signed-apk-android#generating-a-signing-key)
  - edit `~/.gradle/gradle.properties` and replace `<>` values with your own data
    ```
    MYAPP_RELEASE_STORE_FILE=<path to keystore file>
    MYAPP_RELEASE_KEY_ALIAS=<key alias>
    MYAPP_RELEASE_STORE_PASSWORD=<store password>
    MYAPP_RELEASE_KEY_PASSWORD=<key password>
    ```
  - cd repo and run `yarn android:build`
  - folder `/android/app/build/outputs/apk/release/` contains signed apk ready for production
