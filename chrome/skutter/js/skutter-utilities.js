var CC = Components.classes;
var CI = Components.interfaces;

function createAndAdd(element, to, attributes, callback) {
    var e = document.createElement(element);
    if (attributes) {
        for (var a in attributes) e.setAttribute(a, attributes[a]);
    }
    if (callback) { callback(e) }
    if (to) {  to.appendChild(e); }
    return e;
}

function instantiate (contract) {
    try {
        // this is needed to generally allow usage of components in javascript
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        return CC[contract].getService().wrappedJSObject;
    } catch (anError) {
        dump("ERROR: " + anError);
    }
}

function jsdump(str) {
    CC['@mozilla.org/consoleservice;1']
              .getService(CI.nsIConsoleService)
              .logStringMessage(str);
}

function bug(str) {
    alert("BUG! "+str);
    jsdump(str+"\n\n"+ stackTrace(arguments.callee));
}

function getSignature(theFunction) { 
    var signature = theFunction.name; 
    signature += "("; 
    for(var x=0; x<theFunction.arguments.length; x++) { 
    // trim long arguments 
        var nextArgument = theFunction.arguments[x]; 
        if(nextArgument.length > 30) nextArgument = nextArgument.substring(0, 30) + "..."; 
        signature += "'" + nextArgument + "'"; 
        if(x < theFunction.arguments.length - 1) signature += ", "; 
    } 
    signature += ")"; 
    return signature; 
}

function stackTrace(startingPoint) { 
    var stackTraceMessage = "Stack trace: \n"; 
    var nextCaller = startingPoint; 
    do {
        stackTraceMessage += getSignature(nextCaller) + "\n"; 
    } while (nextCaller = nextCaller.caller); 
    return stackTraceMessage + "\n";
}

var sources = {};

function loadSources() {
    const CATEGORY = "skutter-sources";
    var categoryManager = CC["@mozilla.org/categorymanager;1"].getService(CI.nsICategoryManager);
    var enumerator = categoryManager.enumerateCategory(CATEGORY);
    while (enumerator.hasMoreElements()) {
        var item = enumerator.getNext();
        var entry = item.QueryInterface(CI.nsISupportsCString)
        var value = categoryManager.getCategoryEntry(CATEGORY, entry);
        sources[entry.toString()] = instantiate(value);
    }
}


function managedOpen(id, uri) {
    var wm = CC["@mozilla.org/appshell/window-mediator;1"].
             getService(CI.nsIWindowMediator);
    var w = wm.getMostRecentWindow(id);
    if (!w) {
      var wwatch = CC["@mozilla.org/embedcomp/window-watcher;1"].
                   getService(CI.nsIWindowWatcher);
      wwatch.openWindow(null, uri, "_blank", "chrome,dialog=no,all", null);
    } else {
      w.focus(); // Already open
    }
}

var MAX_DUMP_DEPTH = 3;
function dumpObj(obj, name, indent, depth ) {
    if (!name) { name = "someObj" }
    if (!indent) { indent = "" }
    if (!depth) { depth = 0 }
      if (depth > MAX_DUMP_DEPTH) {
             return indent + name + ": <Maximum Depth Reached>\n";
      }

      if (typeof obj == "object") {
             var child = null;
             var output = indent + name + "\n";
             indent += "\t";
             for (var item in obj)
             {
                   try {
                          child = obj[item];
                   } catch (e) {
                          child = "<Unable to Evaluate>";
                   }
                   if (typeof child == "object") {
                          output += dumpObj(child, item, indent, depth + 1);
                   } else {
                          output += indent + item + ": " + child + "\n";
                   }
             }
             return output;
      } else {
             return obj;
      }
}
