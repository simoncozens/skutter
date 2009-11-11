Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function Identica() { 
    this.wrappedJSObject = this;
}

Identica.prototype = {
  classDescription: "Identica",
  classID:          Components.ID("{46A5DC60-E1C7-4668-9A3D-F4D36C531B27}"),
  contractID:       "@skutter.simon-cozens.org/identica;1",
  QueryInterface:   XPCOMUtils.generateQI([Components.interfaces.nsISkutterSource]),
  hello: function() { return "Hello World 2!"; },
  _xpcom_categories: [{
        category: "skutter-sources"
    }]
};
var components = [Identica];
function NSGetModule(compMgr, fileSpec) {
  return XPCOMUtils.generateModule(components);
}

