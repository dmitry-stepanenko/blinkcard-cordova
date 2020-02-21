#!/bin/bash

# enter into ios project folder
HERE="$(dirname "$(test -L "$0" && readlink "$0" || echo "$0")")"
pushd "${HERE}/../src/ios/" > /dev/null

FILENAME='blinkcard-ios.zip'

if [ ! -f "${FILENAME}" ] ; then
    echo "Couldn't find Microblink framework's package '${FILENAME}'. Downloading.."
    LINK='https://github.com/blinkcard/blinkcard-ios/releases/download/v1.1.0/blinkcard-ios_v1.1.0.zip'
    wget --version > /dev/null 2>&1 || { echo "ERROR: couldn't download Microblink framework, install wget" &&  exit 1; }
    wget -O "${FILENAME}" "${LINK}" -nv --show-progress || ( echo "ERROR: couldn't download Microblink framework, Something went wrong while downloading framework from ${LINK}" && exit 1 )
fi

echo "Unzipping ${FILENAME}"
unzip -v > /dev/null 2>&1 || { echo "ERROR: couldn't unzip Microblink framework, install unzip" && exit 1; }
unzip -o "${FILENAME}" > /dev/null 2>&1 && echo "Unzipped ${FILENAME}"

# check if Microblink framework and bundle already exist

if [ -d 'Microblink.bundle' ] ; then
    rm -rf Microblink.bundle && echo "Removing Microblink.bundle"
fi

if [ -d 'Microblink.framework' ] ; then
    rm -rf Microblink.framework && echo "Removing Microblink.framework"
fi 

cd blinkcard-ios || exit 1

mv -f Microblink.framework ../Microblink.framework
mv -f Microblink.bundle ../Microblink.bundle

cd ..

echo "Removing unnecessary files"

rm -rfv blinkcard-ios >/dev/null 2>&1

popd
