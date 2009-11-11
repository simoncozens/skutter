function loadAccounts() {
    var acclist = document.getElementById("accounts");
    for (var a in accounts) { var account = accounts[a];
        createAndAdd("listitem", acclist,
            { label: account.id, onclick: "loadAccountData()" }
        );
    }
    acclist.selected = 0;
    loadAccountData();
}

function loadAccountData() {
    var acclist = document.getElementById("accounts");
    var acc = accounts[acclist.getSelectedItem(0).getAttribute("label")];
    document.getElementById("username").value = acc.username;
    document.getElementById("password").value = acc.password;
}
