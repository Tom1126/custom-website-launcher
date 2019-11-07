// -------------------------------------------------
// Content script for the panel
// -------------------------------------------------
var has_update = 0;
var sequence = new Array();
var websites;

// -------------------------------------------------
// Helper functions
// -------------------------------------------------
//
// Goes through current app layout and generates an array (sequential)
// of apps displayed
//
function get_sequence() {
  as = new Array();
  $("#ga-grid li").each(function () {
    as.push($(this).data("ga-name"));
  });

  console.log('as', as)
  return as.join(',');
}

//
// Based on the current app sequence, construct the grid layout in the panel
//
function layout_apps() {
  $("#ga-grid").empty();

  browser.storage.local.get('appList')
    .then(results => {
      const appListToLoad = Object.keys(results.appList)
      console.log(`Loading applist 2`)
      console.log(appListToLoad)

      const wholeList = results.appList
      websites = results.appList

      for (let i = 0; i < appListToLoad.length; i++) {
        key = appListToLoad[i];
        const curKey = appListToLoad[i]

        $("#ga-grid").append(
          $('<div>')
          .append($('<li>').attr('class', 'ui-state-default').data('ga-name', curKey).append(
              $('<a>').attr('href', wholeList[key]['url'])
              .attr('class', 'ga-lnk')
              .attr('id', 'div-' + curKey).append(

                $('<div>').attr('class', 'nein-wrapper').append(
                  $('<div>').attr('class', 'ga-ico-nein gi-' + key).attr('style','display: none')
                    .attr('id', 'xbtn-'+curKey)
                )
            ).append(
                $('<span>').attr('class', 'ga-ico gi-' + curKey)
                .append(
                  $('<img>')
                  .attr('height', '32')
                  .attr('width', '32')
                  .attr('src', wholeList[curKey]['faviconurl'] ? wholeList[curKey]['faviconurl'] : `gapps-icons.png`)
                )
                .css('background-position', wholeList[curKey]['iconpos'])
              ).append(
                $('<span>').attr('class', 'ga-ico-desc').text(wholeList[curKey]['desc'])
              )
            )
          )
        );
      }
      for(let i = 0, l = appListToLoad.length; i < l; i++) {
        const curKey = appListToLoad[i]
        document.getElementById('xbtn-' + curKey).addEventListener('click', (e) => {
            console.log(`Current key: ${curKey}`)
            delete wholeList[curKey]
            console.log(appListToLoad)
            
            browser.storage.local.set({
            'appList': wholeList
          });
          load_panel()

            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
        })
        document.getElementById('div-'+curKey).addEventListener('mouseover', () => {
          document.getElementById('xbtn-'+curKey).style.display = 'block'
        })
        document.getElementById('div-'+curKey).addEventListener('mouseout', () => {
          document.getElementById('xbtn-'+curKey).style.display = 'none'
        })
      }

    })

    .catch(err => {
      console.error(err)
    })
}

//
// Layout the panel and set up event handlers
//
function load_panel() {

  layout_apps();

  //
  // Set up grid sorting
  //
  //$("#ga-grid").sortable();
  //$("#ga-grid").disableSelection();

  //
  // Let add-on know that app sequence was changed
  //
  $("#ga-grid").on("sortupdate", function (event, ui) {
    var s = get_sequence();
    browser.storage.local.set({
      'appList': s
    });
    console.log("Saving updated sequence after sortupdate");
  });

  //
  // Setup to mask click handling during sorting
  //
  $("#ga-grid").on("sortstart", function (event, ui) {
    console.log("Started sorting. Following click will not be entertained until sortupdate");
    has_update = 1;
  });

  //
  // Send link click event to add-on, so that panel can be hidden
  //
  $(".ga-lnk").on("click", function (e) {
    if (has_update) {
      console.log("Skipping this click event - has_update=1");
    } else {
      browser.tabs.create({
        url: this.href
      });
      e.preventDefault();
      window.close();
    }
  });
}

//
// Split the comma separated app list into an array. Use only the first
// 9 apps to form 3x3 grid
//
function get_applist_arr(applist) {
  var ret;

  const list = Object.keys(applist).slice(0, 36).join(",")

  ret = list.split(",", 9)
  //ret = applist.split(",", 9)
  ret.map(function (app) {
    app.replace(/\s+/gi, '');
  });

  return ret;
};

//
// Helper function for validating items in the App list array.
// Returns: applist if valid, empty array else
//
// Validated to make sure that App list items are valid keys to
// the App information object
//
function validate_applist(applist, gapps_info) {
  applist.every(function (e, i, a) {
    if (!gapps_info.e) {
      return new Array;
    }
  });

  return applist;
}

function loadPanel() {

  load_panel()
}
//console.log('item:::', items)

$(function () {
  loadPanel()
})
// -------------------------------------------------
// Main function that sets up the panel
// -------------------------------------------------