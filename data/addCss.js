function addCss() {
  if(document.createStyleSheet) document.createStyleSheet(`bootstrap-material-design.min.css`)
  else {
    let styleSheet = document.createElement('link')
    styleSheet.href = `bootstrap-material-design.min.css`
    styleSheet.rel = 'stylesheet'
    styleSheet.type = 'text/css'
    document.getElementsByTagName('head')[0].appendChild(styleSheet)
  }
}

addCss()