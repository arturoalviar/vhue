const path = require('path')
const buildDmg = require('electron-installer-dmg')
const VERSION = process.env.npm_package_version;
const options = {
  appPath: path.join(__dirname, '../build/vhue-darwin-x64/vhue.app'),
  name: `vhue-${VERSION}`,
  title: 'Install vhue',
  icon: path.join(__dirname, '../build/icons/icon.icns'),
  out: path.join(__dirname, '../build/dmg'),
  overwrite: true,
}

buildDmg(options, function(error){
  console.log(error)
})
