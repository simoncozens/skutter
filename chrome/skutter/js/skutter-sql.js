var schemaVersion = 2;
var dserv = Components.classes["@mozilla.org/file/directory_service;1"] 
                     .getService(Components.interfaces.nsIProperties);

var file = dserv.get("ProfD", Components.interfaces.nsIFile);
file.append("skutter.db");

var ours = dserv.get("resource:app", Components.interfaces.nsIFile);
ours.append("chrome");
ours.append("skutter.db");
if (!file.exists()) {
    if (!ours.exists()) { alert("Oops, I can't find my own database in "+ours.path) }
    ours.copyTo(dserv.get("ProfD", Components.interfaces.nsIFile), "skutter.db");
}

var storageService = Components.classes["@mozilla.org/storage/service;1"]
                        .getService(Components.interfaces.mozIStorageService);
var mDBConn = storageService.openDatabase(file);

function Skut() {}; databaseClass(Skut, "skut", [ "id", "content", "time", "irt_skut", "irt_uid", "username", "userid", "userscreenname", "source", "favourited", "user_imageurl"]);
function FolderItem() {}; databaseClass(FolderItem, "folder_item", [
"id", "folder", "skut", "read" ]);

// Various functions to upgrade the schema on changes
function schema_version () { 
	try {
		var statement = mDBConn.createStatement("SELECT schema_version FROM skutter_system");
		statement.executeStep();
        var ver = statement.getString(0);
        statement.reset();
		return ver; 
	} catch (e) { return 1 }
}

function databaseClass (where, table, cols) {
    where.prototype.init = function (values) {
        var that = this;
        values.forEach(function (e,i) { that["_"+that.columns[i]] = e});
    };
    where.prototype.table = table;
    where.prototype.columns = cols;

    // Make accessors
    cols.forEach(function (e) { 
        where.prototype[e] = function (val) { 
            if (val) this.set(e, val);
            return this["_"+e];
        }
    });

    where.prototype.select_clause = "SELECT "+cols.join(", ")+" FROM "+table; 
    where.retrieveAll = function (callback)  {
        return doSQL(this.prototype.select_clause, this, callback)
    }
    where.retrieve = function (id)  {
        var a = doSQL(this.prototype.select_clause + " WHERE id = "+id, this);
        if (a) { return a[0] }
    }
    // delete was a reserved word in JS 1.5
    where.prototype.drop = function ()  {
        if (this.tidy_up) { this.tidy_up() } 
        doSQLStatement("DELETE FROM "+table+" WHERE id="+this.id());
    }
    where.prototype.set = function (name, val) {
        jsdump("Calling set "+name+"="+val+" ON id "+this._id);
        doSQLStatement("UPDATE "+table+" SET "+name+" = (?1) WHERE id="+this.id(), [val]);
        this["_"+name] = val;
    }

    where.create = function (myO) {
        var cols = new Array(); var values = new Array();
        for (x in myO) {
            cols.push(x); values.push(myO[x]);
        }
        var cc = "INSERT INTO "+table+" ("+cols.join(", ")+") VALUES (";
        for (var i=1;  i <= cols.length; i++) { cc += "(?"+i+"), "; }
        cc = cc.replace(/, $/, ")");
        doSQLStatement(cc, values);
        return where.retrieve(auto_increment_value());
    }
};

function doSQL(sql, targetClass, callback, params) {
    var rv = new Array;
    var statement;
    try {
        statement = mDBConn.createStatement(sql);
    } catch (e) {
        jsdump("Bad SQL: "+sql);
        jsdump(e);
        return;
    }
    if (params) {
        for (var i =0; i < params.length; i++) 
            statement.bindStringParameter(i, params[i]);
    }
    while (statement.executeStep()) {
        var c;
        var thisArray = new Array;
        for (c=0; c< statement.numEntries; c++) {
            thisArray.push(statement.getString(c));
        }
        if (targetClass) {
            var thing = new targetClass(thisArray);
            for(var i=0; i < thing.columns.length; i++)
                thing["_"+thing.columns[i]] = thisArray[i];
            if (callback) { callback(thing) } 
            rv.push(thing)
        } else { rv.push(thisArray) } 
    }
	statement.reset();
    return rv;
}

function doSQLStatement(sql, params) {
    var statement;
	try	{ statement = mDBConn.createStatement(sql); } catch (e) { alert("SQL setup failed: "+sql); }
    if (params) {
        for (var i =0; i < params.length; i++) 
            statement.bindStringParameter(i, params[i]);
    }
    statement.execute();
	statement.reset();
}

function auto_increment_value () { return mDBConn.lastInsertRowID; }

FolderItem.prototype.skut = function () {
    var s = doSQL(Skut.prototype.select_clause+" WHERE id = (?1)", Skut, null, [this._skut]);
    return s[0];
};

Folder.prototype.unreadCount = function () {
    var statement = mDBConn.createStatement('SELECT count(*) FROM folder_item WHERE folder = (?1) AND read != "1"');
    statement.bindStringParameter(0, this.id);
    statement.executeStep();
    var c = statement.getInt32(0);
    statement.reset();
    return c;
};

Folder.prototype.recentItems = function () {
    return doSQL(FolderItem.prototype.select_clause+" WHERE folder = (?1)", FolderItem, null, [this.id]);
}

function mkSpan(text, class) { 
    var s = document.createElementNS('http://www.w3.org/1999/xhtml','html:span');
    if (class) s.setAttribute("class", class);
    s.appendChild(document.createTextNode(text));
    return s;

}
FolderItem.prototype.asXUL = function (f) {
    var t = this;
    var box = document.createElementNS('http://www.w3.org/1999/xhtml','html:div');
    box.setAttribute("class", "folderitem "+((t.read()==0)?"unread":"read"));
    box.addEventListener("click", function () { 
        t.read("1");
        this.setAttribute("class", "folderitem read");
        checkUnreadCount(f.listItem);
        }, false
    ); 
    var img = document.createElementNS('http://www.w3.org/1999/xhtml','html:img');
    img.setAttribute("src", t.skut().user_imageurl()); 
    box.appendChild(img);
    box.appendChild(mkSpan(t.skut().content()));
    var br = document.createElementNS('http://www.w3.org/1999/xhtml','html:br');
    var auxinfo = document.createElementNS('http://www.w3.org/1999/xhtml','html:div');
    auxinfo.setAttribute("class", "auxinfo");
    auxinfo.appendChild(mkSpan("by ", "labels"));
    auxinfo.appendChild(mkSpan(t.skut().userscreenname()));
    //box.appendChild(mkSpan(" using ", "labels"));
    //box.appendChild(mkSpan(t.skut().source()), "auxinfo");
    if (t.skut().irt_skut()) {
        auxinfo.appendChild(mkSpan(" in reply to ", "labels"));
    }
    box.appendChild(auxinfo);
    return box;
} 
