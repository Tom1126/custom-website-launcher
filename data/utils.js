function addWebsite() {
  const website = prompt('Enter website url').trim()
  if(!Object.is(website, null) && !Object.is(website, '')) {
    console.log(`Website: ${website}`)
    //console.log(`List: ${JSON.stringify(gapps_info)}`)
    const tabTitle = tabs.activeTab.url 
    console.log(tabTitle)
  }
}

function getTabsInfo() {
  browser.tabs.query({currentWindow: true, active: true})
    .then(tabs => {
      for(let tab of tabs) {
        console.log(tab.url)
        console.log(tab.title)
        console.log(tab.favIconUrl)
      }
      const activeTab = tabs[0]
      const splitTitle = activeTab.title.split(" ")[0]
      console.log(splitTitle)
      let newObj = {}
      newObj[splitTitle] = {
        url: activeTab.url,
        desc: splitTitle,
        iconpos: "0px -690px"
      }

      console.log(newObj)
      gapps_info = { ...newObj, ...gapps_info}
      console.log(gapps_info)
      loadPanel()
    })
}

document.getElementById('addBtn2').addEventListener('click', getTabsInfo)
document.getElementById('addBtn').addEventListener('click', addWebsite)