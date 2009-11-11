use File::Find;
die "No songbee.exe, you in the right directory?" unless -f "songbee.exe";
my $part1;
find({no_chdir => 1,
        wanted => sub { $a=$_;s/..//; s/\//\\/g;
            $part1 .= -d $a ? 
                    "SetOutPath \"\$INSTDIR\\" 
                   : "File \"";
            $part1 .= "$_\"\n";
            if (-d $a) {
                $part3 .= qq{ RMDir "\$INSTDIR\\$_"\n};
            } else {
                $part2 .= qq{ Delete "\$INSTDIR\\$_"\n};
            }
        }}, ".");

my $script = do { local $/; <DATA> };
$script =~ s/; Set Section Files and Shortcuts/$part1/;
$script =~ s/; Clean up Songbee/$part2$part3/;
my $ver = shift @ARGV;
die "No version" unless $ver;
print qq{!define VERSION "$ver"\n};
print $script;

__DATA__
; Script generated with the Venis Install Wizard

; Define your application name
!define APPNAME "Songbee"
!define APPNAMEANDVERSION "Songbee ${VERSION}"

; Main Install settings
Name "${APPNAMEANDVERSION}"
InstallDir "$PROGRAMFILES\Songbee"
InstallDirRegKey HKLM "Software\${APPNAME}" ""
OutFile "SongbeeSetup.exe"

; Modern interface settings
!include "MUI.nsh"

!define MUI_ABORTWARNING

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Set languages (first is default language)
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_RESERVEFILE_LANGDLL

Section "Songbee" Section1

	; Set Section properties
	SetOverwrite on

	; Set Section Files and Shortcuts

	CreateShortCut "$DESKTOP\Songbee.lnk" "$INSTDIR\songbee.exe"
	CreateDirectory "$SMPROGRAMS\Songbee"
	CreateShortCut "$SMPROGRAMS\Songbee\Songbee.lnk" "$INSTDIR\songbee.exe"
	CreateShortCut "$SMPROGRAMS\Songbee\Uninstall.lnk" "$INSTDIR\uninstall.exe"

SetOutPath "$INSTDIR\xulrunner"
Exec '"$OUTDIR\xulrunner.exe" --register-global'
SectionEnd

Section -FinishSection

	WriteRegStr HKLM "Software\${APPNAME}" "" "$INSTDIR"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$INSTDIR\uninstall.exe"
	WriteUninstaller "$INSTDIR\uninstall.exe"

SectionEnd

; Modern install component descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
	!insertmacro MUI_DESCRIPTION_TEXT ${Section1} ""
!insertmacro MUI_FUNCTION_DESCRIPTION_END

;Uninstall section
Section Uninstall

	;Remove from registry...
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
	DeleteRegKey HKLM "SOFTWARE\${APPNAME}"

	; Delete self
	Delete "$INSTDIR\uninstall.exe"

	; Delete Shortcuts
	Delete "$DESKTOP\Songbee.lnk"
	Delete "$SMPROGRAMS\Songbee\Songbee.lnk"
	Delete "$SMPROGRAMS\Songbee\Uninstall.lnk"

	; Clean up Songbee
	RMDir "$INSTDIR\"

SectionEnd

; eof
