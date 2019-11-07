// -------------------------------------------------
// Content script for the panel
// -------------------------------------------------
var has_update = 0;
var sequence = new Array();

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

  // Empties the websites list displayed in the pop up
  $("#ga-grid").empty();

  // Get the websites list from the storage
  browser.storage.local.get('appList')
    .then(results => {

      // Get the websites list
      const appListToLoad = Object.keys(results.appList)

      const wholeList = results.appList

      // Goes through the whole websites list
      for (let i = 0; i < appListToLoad.length; i++) {
        
        //Get current website
        const curKey = appListToLoad[i]

        // Add the website to the list to be displayed
        $("#ga-grid").append(
          $('<div>')
          .append($('<li>').attr('class', 'ui-state-default').data('ga-name', curKey).append(
            $('<a>').attr('href', wholeList[curKey]['url'])
            .attr('class', 'ga-lnk')
            .attr('id', 'div-' + curKey).append(

              $('<div>').attr('class', 'nein-wrapper').append(
                $('<div>').attr('class', 'ga-ico-nein gi-' + curKey).attr('style', 'display: none')
                .attr('id', 'xbtn-' + curKey)
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
          ))
        );
      }

      // Add event listeners for the x buttons on each website
      for (let i = 0, l = appListToLoad.length; i < l; i++) {
        const curKey = appListToLoad[i]

        // Adds event listener to delete website from websites list
        document.getElementById('xbtn-' + curKey).addEventListener('click', (e) => {
          
          delete wholeList[curKey]
          
          // Updates the list on storage and loads the panel
          browser.storage.local.set({
            'appList': wholeList
          });
          
          load_panel()

          e.stopImmediatePropagation();
          e.stopPropagation();
          e.preventDefault();
        })
        document.getElementById('div-' + curKey).addEventListener('mouseover', () => {
          document.getElementById('xbtn-' + curKey).style.display = 'block'
        })
        document.getElementById('div-' + curKey).addEventListener('mouseout', () => {
          document.getElementById('xbtn-' + curKey).style.display = 'none'
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

// -------------------------------------------------
// Main function that sets up the panel
// -------------------------------------------------
$(function () {
  load_panel()
})