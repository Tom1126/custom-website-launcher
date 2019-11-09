/**
 * Function to retrieve infomation on current website and add it to the websites list
 */
function getTabsInfo() {

  //Query the current tab
  browser.tabs.query({
      currentWindow: true,
      active: true
    })
    .then(tabs => {

      // Get the curent tab and its first word of the title
      const activeTab = tabs[0]
      const splitTitle = activeTab.title.split(" ")[0]

      // Prompts user to add description 
      const userDesc = prompt(`Enter a description for the website`, splitTitle)

      //Executes when the description entered by the user is not null and empty 
      if (userDesc !== null && userDesc.trim() !== '') {

        // Creates a new object with the details of the current tab
        let newObj = {}
        newObj[userDesc] = {
          url: activeTab.url,
          desc: userDesc,
          iconpos: "0px -690px",
          faviconurl: `http://f1.allesedv.com/32/${activeTab.url}`
        }

        // Get website list from storage, updates the list and loads the panel
        const getListFromStorage = browser.storage.local.get('appList')
        getListFromStorage.then(results => {
          let listFromStorage = results.appList
          listFromStorage = {
            ...newObj,
            ...listFromStorage
          }

          // Save the new list to storage and load panel
          saveToStorage(listFromStorage)
          load_panel()
        })

      }

    })

}

/**
 * Function to save websites list to storage
 * @param {Object} apps_info 
 */
function saveToStorage(apps_info) {
  browser.storage.local.set({
    'appList': apps_info
  });
}

document.getElementById('addBtn2').addEventListener('click', getTabsInfo)
