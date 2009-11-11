Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
function Twitter() { this.wrappedJSObject = this; }

Twitter.prototype = {
  classDescription: "Twitter",
  classID:          Components.ID("{83CF4A3A-F064-4875-8106-C94162360094}"),
  contractID:       "@skutter.simon-cozens.org/twitter;1",
  QueryInterface:   XPCOMUtils.generateQI([Components.interfaces.nsISkutterSource]),
  _xpcom_categories: [{
        category: "skutter-sources"
  }],
};


var components = [Twitter];
function NSGetModule(compMgr, fileSpec) {
  return XPCOMUtils.generateModule(components);
}

