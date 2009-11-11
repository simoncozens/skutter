Components.utils.import("resource://modules/Preferences.js");

var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService);
var accountsBranch = prefs.getBranch("skutter.accounts.");
var pObj = new Preferences("skutter.accounts.");
// The module doesn't help us with this, do it by hand.
var children = accountsBranch.getChildList("",{});
accounts = {};

function Account () {}; 
function Folder (acobj, name) { 
    this.account = acobj; this.name = name;
    this.id = this.account.id+":"+this.name;
} 

Account.prototype = {
    makeTH: function() { return new TwitterHelper(this.username, this.password, document.getElementById("throbber"), this.service); },
};

// Essentially we're marshalling the preferences tree into a Javascript
// object. You'd think there'd be a module to do this for you.
for (var i in children) { 
    var mObj = children[i].match(/^((.*)@(.*?))\.(.*)$/); 
    if (!mObj) { continue }
    var account = mObj[1];
    var pref = mObj[4];
    if (!accounts[account]) {
        accounts[account] = new Account();
        accounts[account].username = mObj[2];
        accounts[account].service  = mObj[3];
        accounts[account].id = account;
    }
    var mObj2;
    if ((mObj2 = pref.match(/folders\.(.*)\.(.*)/))) {
        if (!accounts[account].folders) { accounts[account].folders = {} }
        var folders = accounts[account].folders;
        if (!folders[mObj2[1]]) { folders[mObj2[1]] = new Folder(accounts[account], mObj2[1]) }
        var folder = folders[mObj2[1]] 
        folder[mObj2[2]] = pObj.get(children[i]);
    } else {
        accounts[account][pref] = pObj.get(children[i]);
    }
}
jsdump(dumpObj(accounts));
