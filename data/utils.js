function getTabsInfo() {

  browser.tabs.query({
      currentWindow: true,
      active: true
    })
    .then(tabs => {
      const activeTab = tabs[0]
      const splitTitle = activeTab.title.split(" ")[0]
      console.log(splitTitle)

      const userDesc = prompt(`Enter a descrition for the website`, splitTitle)

      if (userDesc !== null && userDesc.trim() !== '') {
        let newObj = {}
        newObj[userDesc] = {
          url: activeTab.url,
          desc: userDesc,
          iconpos: "0px -690px",
          faviconurl: `http://f1.allesedv.com/32/${activeTab.url}`
        }

        /*
        let listFromStorage = {...websites}
        listFromStorage = {...newObj, ...listFromStorage}
        websites = {...listFromStorage}
        saveToStorage(listFromStorage)
        load_panel()
        */

        
        const getListFromStorage = browser.storage.local.get('appList')
        getListFromStorage.then(results => {
          let listFromStorage = results.appList
          listFromStorage = {
            ...newObj,
            ...listFromStorage
          }
          saveToStorage(listFromStorage)
          load_panel()
        })
        

      }
    })

}

function saveToStorage(apps_info) {
  browser.storage.local.set({
    'appList': apps_info
  });
  /*
  savedResults.then(function (items) {
    
    restore();
  })
  */
}

function restore() {
  function set(res) {
    if (res.appList === undefined) {
      res.appList = default_applist;
      console.log("Initial set")
    }
    $("#appList").val(res.appList);
    applist_edit();
  }

  function onError(e) {
    console.log("Error getting appList setting, restoring defaults");
    console.log(e);
    setdefault();
  }
  var getting = browser.storage.local.get("appList");
  getting.then(set, onError);
}

function applist_edit(e) {
  $("#applist-val").empty().append(validate_list($("#appList").val()));
}

function validate_list(lst) {
  var sep = /\s*,\s*/;
  var apps = lst.split(sep);
  var val_arr = $('<div>');

  for (i = 0; i < apps.length; i++) {
    var cls = (i > 8) ? 'exc' :
      (gapps_info.hasOwnProperty(apps[i])) ?
      (((i > 0) && (apps.slice(0, i).includes(apps[i]))) ? 'dup' : 'good') : 'bad';

    var a = $('<span>').attr('class', cls).text(apps[i]);
    val_arr.append(a);
    if ((apps.length > 1) && (i < apps.length - 1)) {
      val_arr.append(",");
    }
  }
  return val_arr;
}

document.getElementById('addBtn2').addEventListener('click', getTabsInfo)