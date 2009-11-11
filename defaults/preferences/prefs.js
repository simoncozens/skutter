pref("toolkit.defaultChromeURI", "chrome://skutter/content/skutter-main.xul"); 
//pref("browser.chromeURL", "chrome://skutter/content/navigator.xul") 
user_pref("signed.applets.codebase_principal_support", true);
/* debugging prefs */
pref("browser.dom.window.dump.enabled", true);
pref("security.fileuri.strict_origin_policy", false);
pref("javascript.options.showInConsole", true);
pref("javascript.options.strict", true);
pref("nglayout.debug.disable_xul_cache", true);
pref("nglayout.debug.disable_xul_fastload", true);

pref("app.update.enabled", true);
pref("app.update.auto", true);
pref("app.update.mode", 1);
pref("app.update.silent", false);
// XXX Need to get this update server running.
pref("app.update.url", "http://skutter.simon-cozens.org/cgi-bin/update.pl/%VERSION%/%OS_VERSION%");
pref("app.update.url.manual", "http://skutter.simon-cozens.org/");
pref("app.update.url.details", "http://skutter.simon-cozens.org/");
pref("app.update.interval", 86400);
pref("app.update.nagTimer.download", 86400);
pref("app.update.nagTimer.restart", 1800);
pref("app.update.timer", 600000);
pref("app.update.showInstalledUI", true);
pref("app.update.incompatible.mode", 0);

   user_pref("app.update.log.Checker", true);
   user_pref("app.update.log.Downloader", true);
   user_pref("app.update.log.General", true);
   user_pref("app.update.log.UI:CheckingPage", true);
   user_pref("app.update.log.UI:DownloadingPage", true);
   user_pref("app.update.log.UI:LicensePage", true);
   user_pref("app.update.log.UpdateManager", true);
   user_pref("app.update.log.UpdateService", true); 

pref("xpinstall.dialog.confirm", "chrome://mozapps/content/xpinstall/xpinstallConfirm.xul");
pref("xpinstall.dialog.progress.skin", "chrome://mozapps/content/extensions/extensions.xul?type=themes");
pref("xpinstall.dialog.progress.chrome", "chrome://mozapps/content/extensions/extensions.xul?type=extensions");
pref("xpinstall.dialog.progress.type.skin", "Extension:Manager-themes");
pref("xpinstall.dialog.progress.type.chrome", "Extension:Manager-extensions");
pref("extensions.update.enabled", true);
pref("extensions.update.interval", 86400);
pref("extensions.dss.enabled", false);
pref("extensions.dss.switchPending", false);
pref("extensions.ignoreMTimeChanges", false);
pref("extensions.logging.enabled", false);
pref("general.skins.selectedSkin", "classic/1.0");
// NB these point at AMO
pref("extensions.update.url", "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.getMoreExtensionsURL", "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.getMoreThemesURL", "chrome://mozapps/locale/extensions/extensions.properties");

