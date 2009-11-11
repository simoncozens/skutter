VERSION = 2.1
SCRATCHDIR = /tmp/songbee-dist
PRISTINE = /tmp/songbee-pristine
RELEASEDIR = /tmp/songbee-releases

checklist:
	@echo "Have you updated the version in this Makefile?"
	@echo "Have you updated the version in Info.plist and application.ini?"
	@echo "Have you updated README.unix?"
	@echo "Have you updated update.xml and any mars on the web site"
	@echo "Have you rebuilt the manual PDF? (And updated the manual!)"
	@echo "Are you using the latest xulrunner? (Check also this Makefile)"
	@echo "Have you checked the xulrunner version in install.sh?"
	@echo "Have you checked all your changes into git?"
	@cd ..; git status
	@echo "If so, then you can make release."

release : release-osx release-win release-unix

release-osx : dist-osx

dist-osx:
	rm -rf ~/songbee/dist
	mkdir -p ~/songbee/dist/Applications/
	ditto ~/songbee/Songbee.app ~/songbee/dist/Applications/Songbee.app
	cd ~/songbee/dist/Applications/Songbee.app/; rm -rf **/.git **/.work Contents/Resources/songs Contents/Resources/release-manager-tools Contents/Resources/manual

release-win : checkout-pristine create-clean-dist get-xulrunner add-icon make-installer

release-unix : checkout-pristine create-clean-dist zip-dist
	mkdir $(SCRATCHDIR)/songbee-$(VERSION)
	mv $(SCRATCHDIR)/songbee.zip $(SCRATCHDIR)/songbee-$(VERSION)
	cp $(PRISTINE)/release-manager-tools/README.unix $(SCRATCHDIR)/songbee-$(VERSION)/README
	cp $(PRISTINE)/manual/book.pdf $(SCRATCHDIR)/songbee-$(VERSION)/manual.pdf
	cp $(PRISTINE)/release-manager-tools/install.sh $(SCRATCHDIR)/songbee-$(VERSION)
	tar czvf $(RELEASEDIR)/songbee-$(VERSION).tar.gz $(SCRATCHDIR)/songbee-$(VERSION)	

checkout-pristine :
	rm -rf $(PRISTINE)
	mkdir $(PRISTINE)
	git clone git://github.com/simoncozens/songbee.git $(PRISTINE)

create-clean-dist:
	rm -rf $(SCRATCHDIR)
	cp -ar $(PRISTINE) $(SCRATCHDIR)
	cd $(SCRATCHDIR); rm -rf Songbee.icns release-manager-tools **/svn-commit* **/.git songs manual load.pl
	cd $(SCRATCHDIR); find . -name '.git' -print0 | xargs -0 rm -rf

zip-dist:
	cd $(SCRATCHDIR);zip -r songbee.zip *

get-xulrunner:
	cd $(SCRATCHDIR);wget http://releases.mozilla.org/pub/mozilla.org/xulrunner/releases/1.9.0.13/runtimes/xulrunner-1.9.0.13.en-US.win32.zip
	cd $(SCRATCHDIR);unzip xulrunner-*.en-US.win32.zip
	rm $(SCRATCHDIR)/xulrunner-*.en-US.win32.zip 
	mv $(SCRATCHDIR)/xulrunner/xulrunner-stub.exe $(SCRATCHDIR)/songbee.exe

add-icon: 
	convert $(SCRATCHDIR)/chrome/branding/icon48.png $(SCRATCHDIR)/songbee.ico
	exe_update.pl --icon $(SCRATCHDIR)/songbee.ico $(SCRATCHDIR)/songbee.exe

make-installer: 
	cd $(SCRATCHDIR); perl $(PRISTINE)/release-manager-tools/write-nsi.pl $(VERSION) > songbee.nsi
	cd $(SCRATCHDIR); makensis songbee.nsi
	cp $(SCRATCHDIR)/SongbeeSetup.exe $(RELEASEDIR)/SongbeeSetup-$(VERSION).exe
