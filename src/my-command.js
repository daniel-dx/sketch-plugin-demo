import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
var Document = require('sketch/dom').Document

const webviewIdentifier = 'sketch-plugin-demo.webview'

// export default function () {
//   let str = NSMutableString.alloc().init()
//   let pointer = MOPointer.alloc().initWithValue(str)

//   str.setString('Hello Sketch')
//   console.log(pointer.value())

//   str.appendString(' 👋')
//   console.log(pointer.value())
// }

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 240,
    height: 180,
    show: false
  }

  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message('UI loaded!')
  })

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', s => {
    UI.message(s)
    webContents
      .executeJavaScript(`setRandomNumber(${Math.random()})`)
      .catch(console.error)
  })

  browserWindow.loadURL(require('../resources/webview.html'))
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}
