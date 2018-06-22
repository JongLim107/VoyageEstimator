# VoyageTools with react-native

## Project tructure

        ios - iOS project file
        android - Android project file
        src - all js file
                components      - cross module component(base views)
                constants       - some global config, some static string
                models          - model class
                network         - Network working, socket
                navigation      - Tabbar, StackNavigation, etc
                screens         - screens, views, pages
                stores          - some logic and get data from local or server,link model and pages
                manager         - dbmanager(data accesss, fetch)                        
                utility         - util
        resource - local json data, styles
                string
                        - en
                        - cn
                        - etc
                Styles
                Colors
                fonts
                images

## Style Guide
    [Style Guide](https://github.com/airbnb/javascript/tree/master/react)


## Windows: Setup development enviorenment
install node.js_latest_version / vscode_latest_version / python_version_2.7 / ms_build_tool_2015_full_package


## Plugins
please refer to './package.json'

## Install rnpm for link RN library to Native code
`npm install rnpm -g`

Use like this `rnpm link react-native-vector-icons`

or `rnpm unlink react-native-vector-icons`

and the tool will auto link react-native library to android native build config.


## After clone the project, run this to install dependencies library
`npm install` or `yarn`

### start node.service manually, if use expo. no need this cmd
`npm start` or `npm start -- --reset-cache`
if the cmd above does not working try this `react-native start` or `react-native start -- --reset-cache`

### build ***android*** app
`react-native run-android`
`react-native log-android`


### Android ADB Shell 
`adb devices`
`adb reverse tcp:8081 tcp:8081`
`adb logcat *:S ReactNative:V ReactNativeJS:V`

### Reload RN **android**
`adb shell input keyevent R R R`

### MENU_BUTTON **android**
`adb shell input keyevent 82`

### DELETE THE FORDER ** windows system cmd **
`rd /s /q "path" `


## Enabling decorator syntax
[Enabling decorator syntax](https://mobx.js.org/best/decorators.html)

### TypeScript

Enable the compiler option "experimentalDecorators": true in your tsconfig.json.
```js
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "allowJs": true
    }
}
```

`npm i --save-dev babel-plugin-transform-decorators-legacy`

And enable it in your .babelrc file:

```js
{ "plugins": ["transform-decorators-legacy"] }
```

## Addiction 
### Install React -- Specify the version
`npm install --save react@^16.3.0`
`npm install --save react-native@X.Y`

### Intsall Mapbox for React Native
`npm i @mapbox/react-native-mapbox-gl --save`
or
`yarn add @mapbox/react-native-mapbox-gl`



## ISSUE and Configuration
### NPM Upgrade
`npm i -g npm-upgrade`

### [Configuring Your .npmrc for an Optimal Node.js Environment](http://nodesource.com/blog/configuring-your-npmrc-for-an-optimal-node-js-environment/)
[NPM Config set registry](https://registry.npmjs.com/)
`npm cache clean --force` && `yarn cache clean`
`npm config set registry https://registry.npmjs.org/`
or
`nrm use npm`


### Brightoil Marine Online Registry
`nrm add bmonpm http://nexus.pm.bwoilmarine.com/repository/npm_group/`
`nrm use bmonpm`
#### BMO config account
`npm login --registry http://nexus.pm.bwoilmarine.com/repository/npm_hosted/`
```js
{
    Username: admin
    Password: admin123
    Email: (this IS public) **your email**
}
```


## Attention
If your code use A library which is using a Specific version of another B library.
then you need to install that B library with the correct version before you can install the A library.
Correct : `npm install --save react@16.3.0`
Wrong :`npm install --save react@^16.3.0`

