[ -e songbee.pkg ] || echo "You're in the wrong directory!";
rm -rf dist
mkdir dist
hdiutil create dist/$1.dmg -size 35m -fs HFS+ -volname "Songbee"
dev_handle=`hdid dist/$1.dmg | grep Apple_HFS | perl -e '\$_=<>; /^\\/dev\\/(disk.)/; print \$1'`
ditto -rsrcFork "songbee.pkg" "/Volumes/Songbee/Songbee.pkg"
ditto -rsrcFork Songbee-Volume.icns "/Volumes/Songbee/.VolumeIcon.icns"
/Developer/Tools/SetFile -a C "/Volumes/Songbee/"
hdiutil detach $dev_handle
hdiutil convert dist/$1.dmg -format UDZO -o dist/$1.udzo.dmg
rm -f dist/$1.dmg
mv dist/$1.udzo.dmg dist/$1.dmg
