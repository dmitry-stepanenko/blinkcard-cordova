#!/bin/bash

# enter into ios project folder
HERE="$(dirname "$(test -L "$0" && readlink "$0" || echo "$0")")"
pushd "${HERE}/../src/ios/" > /dev/null

# check if Microblink framework and bundle already exist

if [ ! -d 'Microblink.bundle' ] | [ ! -d 'Microblink.framework' ]; then
    FILENAME='blinkcard-ios.zip'
    echo "Couldn't find Microblink bundle. Will extract it from '${FILENAME}'.."
    # if any of the packages missing, remove everything and unzip it from archive
    rm -rf Microblink.bundle
    rm -rf Microblink.framework

    # if framework package is missing for some reason, load it from blinkcard repo 
    if [ ! -f "${FILENAME}" ] ; then
        echo "Couldn't find Microblink framework's package '${FILENAME}'. Downloading.."
        LINK='https://github.com/blinkcard/blinkcard-ios/releases/download/v1.1.0/blinkcard-ios_v1.1.0.zip'
        wget --version > /dev/null 2>&1 || { echo "ERROR: couldn't download Microblink framework, install wget" &&  exit 1; }
        wget -O "${FILENAME}" "${LINK}" -nv --show-progress || ( echo "ERROR: couldn't download Microblink framework, Something went wrong while downloading framework from ${LINK}" && exit 1 )
    fi

    echo "Unzipping ${FILENAME}"
    unzip -v > /dev/null 2>&1 || { echo "ERROR: couldn't unzip Microblink framework, install unzip" && exit 1; }
    unzip -o "${FILENAME}" > /dev/null 2>&1 && echo "Unzipped ${FILENAME}"
    cd blinkcard-ios || exit 1

    mv -f Microblink.framework ../Microblink.framework
    mv -f Microblink.bundle ../Microblink.bundle

    cd ..

    echo "Removing unnecessary files"

    rm -rfv blinkcard-ios >/dev/null 2>&1

fi

popd > /dev/null
