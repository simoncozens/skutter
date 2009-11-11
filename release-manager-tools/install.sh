#!/bin/sh
if [ "XX" = "XX"`which xulrunner` ]; then
    echo "xulrunner not installed at all!"; exit 1;
fi;
if [ `xulrunner --gre-version` '<' 1.9.0 ]; then
    echo "We need xulrunner >1.9.0"; exit 1;
fi;
xulrunner --register-global
TARGET=$1;
if [ -z $1 ]; then
    TARGET=/usr/lib/
fi;

xulrunner --install-app songbee.zip $TARGET
if [ ! -e $TARGET/songbee/songbee ]; then
    echo "Something went wrong with the installation!"; exit 1;
fi;
echo "Songbee is installed in $TARGET/songbee/";
if [ -f /usr/local/bin/songbee ]; then
    rm /usr/local/bin/songbee
fi;
ln -s $TARGET/songbee/songbee /usr/local/bin/songbee 
echo "Run /usr/local/bin/songbee to start!"
