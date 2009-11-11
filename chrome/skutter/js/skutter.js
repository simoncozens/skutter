Components.utils.import("resource://modules/twitterHelper.jsm");
//var prefs = Components.classes["@mozilla.org/preferences-service;1"]
//                    .getService(Components.interfaces.nsIPrefService);
//var accountsBranch = prefs.getBranch("skutter.accounts.");


function setupTabs () {
    //if (!accounts) 
    for (var x in accounts) { 
        var account = accounts[x];
        var th = account.makeTH();
        createAndAdd("tab", document.getElementById("tabs"), {
           label: th.mAccount+"@"+th.mServiceName,
           _account: x
        });
        // There must be a better way than this. :(
        createAndAdd("tabpanel", document.getElementById("tabpanels"), 
            { flex: "1" },
            function (t) { 
                createAndAdd("listbox", t, { flex: "1" }, function(t) {
                    addListItems(t, account);
                } );
                createAndAdd("splitter", t, {collapse: "none"});
                createAndAdd("vbox", t, {
                    id: "skutcanvas"+account.id,
                    class: "skutcanvas"
                });
            }
        );
    }
    document.getElementById("tabs").focus();
    document.getElementById("tabs").selectedIndex = 1;
}

function post () {
    var ac = accounts[document.getElementById("tabs").selectedItem.getAttribute("_account")];
    var skut = document.getElementById("skut").value;
    if (skut.length > 140) { alert("Skut too long"); return }
    ac.makeTH().statuses.update(function(){alert("Posted OK!")},
                                function(a,b,c){alert(b)},
                                null,"json",skut,null, 'Skutter');
}

function checkUnreadCount(listitem) {
    var f = folderForListItem(listitem);
    var unread = f.unreadCount();
    if (unread > 0) {
         listitem.setAttribute("class", "hasunread");
         listitem.setAttribute("label", f.name+" ("+unread+")");
    } else { 
         listitem.setAttribute("class", "");
         listitem.setAttribute("label", f.name);
    }
}

function addListItems(to, account) {
    to.setAttribute("id", "folderlist"+account.id);
    to.setAttribute("onselect", "changeFolder('folderlist"+account.id+"')");
    for (f in account.folders) {
        var folder = account.folders[f];
        folder.listItem = createAndAdd("listitem", to, { label: f, _account_id: account.id, _folder_name: folder.name});
        setupFetch(folder);
        checkUnreadCount(folder.listItem);
    }
    to.focus();
    to.selectedIndex = 0;
    /*
    createAndAdd("listitem", to, { label: "Replies" });
    setupFetch(account, "Replies");
    createAndAdd("listitem", to, { label: "Direct Messages" });
    setupFetch(account, "DMs");
    */
}

function folderForListItem(listItem) {
    var account = listItem.getAttribute("_account_id");
    var folder = listItem.getAttribute("_folder_name");
    return  accounts[account].folders[folder];
}

function changeFolder (list) { 
    var listBox = document.getElementById(list);
    jsdump(listBox.tagName);
    var folder = folderForListItem(listBox.getSelectedItem(0));
    var items = folder.recentItems();
    var account = folder.account.id;
    var canvas = document.getElementById("skutcanvas"+account);
    while (canvas.childNodes.length > 0) { canvas.removeChild(canvas.firstChild) }
    for (var i in items) { canvas.appendChild(items[i].asXUL(folder)) }
}

function setupFetch(folder) {
    var th = folder.account.makeTH();
    var event = { notify: function() { 
        if (folder.type == "friends") {
            th.statuses.friends_timeline(
                updateFolder,
                function(aTH, aRequest) { jsdump(aRequest) }, 
                folder, "json"
            );
        } else if (folder.type == "replies") { 
            th.statuses.replies(
                updateFolder,
                function(aTH, aRequest) { jsdump(aRequest) }, 
                folder, "json"
            );
        }
    }};
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefBranch);
    var timer = Components.classes["@mozilla.org/timer;1"]
        .createInstance(Components.interfaces.nsITimer);
    var interval = 100000; // prefs.getIntPref('aktinterval') || 10000;
    timer.initWithCallback(event, interval,
        Components.interfaces.nsITimer.TYPE_REPEATING_SLACK
    );
    // Fire one off now though.
    event.notify();
}

function timeToEpoch (t) { return t; } 

function updateFolder(th, skuts, folder) {
    for (var i in skuts) fileSkut(folder, skuts[i]);
    accountsBranch.setIntPref(
        th.mAccount+"@"+th.mServiceName+".folders."+folder.name+".lastChecked",
        (new Date()).getTime() / 1000
    );
    checkUnreadCount(folder.listItem);
}

function fileSkut(folder, answer) { 
    var skut;
    if (!( skut = Skut.retrieve(answer.id))) {
        skut = Skut.create({
            id: answer.id,
            content: answer.text,
            time: timeToEpoch(answer.created_at),
            irt_skut: answer.in_reply_to_status_id,
            irt_uid: answer.in_reply_to_user_id,
            username: answer.user.name,
            userid: answer.user.id,
            userscreenname: answer.user.screen_name,
            user_imageurl: answer.user.profile_image_url,
            source: answer.source,
            favourited: answer.favourited
        });
    }
    FolderItem.create({ // if it doesn't already exist XXX
        folder: folder.id,
        skut: answer.id,
        read: 0
    });
}
