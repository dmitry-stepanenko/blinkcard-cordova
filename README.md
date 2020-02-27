# BlinkCard SDK wrapper for Cordova

This repository contains wrapper for BlinkCard native SDKs ([iOS](https://github.com/blinkcard/blinkcard-ios) and [Android](https://github.com/blinkcard/blinkcard-android)). Not all features of native SDKs are available in PhoneGap wrapper. However, the wrapper is open source, so you can easily add features that you need. For 100% of features and maximum control, consider using native SDKs.

Please note, that current repository is a fork of this [BlinkID Repo](https://github.com/BlinkID/blinkid-cordova/). It was rewritten to support functionality of BlinkCard, that was removed from _blinkid-cordova_ starting from V5. All the functionality of BlinkID was removed.

## Cordova version
BlinkCard requires Cordova **v7.0.0 or later** and cordova-android plugin **v7.0.0 or later**.

## Ionic version

Latest version has been tested using Ionic **3.19.0** version.

## Adding blinkcard-cordova to your application

You can add blinkcard-cordova by cloning the repository and following instructions below or by running

```shell
cordova plugin add blinkcard-cordova
```

> The shown instructions are for **Cordova**, the instructions for **Ionic** and **PhoneGap** are practically the same, except for some slight command line argument differences.

In the repository you will find scripts to create sample applications.

## Clone or Download repository
Downloading a repository just downloads the files from the most recent commit of the default branch but without all the dependencies which are in submodules. We recommend that you clone directory. With a clone option you will get a copy of the history and it’s functional git repository.

To clone repository:
+ **Copy URL from the `Clone or download` button: https://github.com/cuddlemeister/blinkcard-cordova.git**
+ **Open terminal on Mac/Linux or [GitBash](https://git-for-windows.github.io/) on Windows.**
+ **cd into directory where you want the cloned directory to be made.**
+ **Type `git clone ` , than past URL**
+ **Press enter**

### Licensing

- [Generate](https://microblink.com/login?url=/customer/generatedemolicence) a **free demo license key** for BlinkCard both for Android and IOS platforms to start using the SDK in your app (registration required)

- Get information about pricing and licensing of [BlinkID](https://microblink.com/blinkid)
