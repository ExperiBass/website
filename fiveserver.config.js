module.exports = {
    root: 'site',
    //host: '::1',
    ignore: [/\.handlebars$/g, /\.config.js$/g, /(build|galleries).js$/g],
    highlight: true, // enable highlight feature
    injectBody: true, // enable instant update
    remoteLogs: true, // enable remoteLogs
    remoteLogs: 'yellow', // enable remoteLogs and use the color yellow
    injectCss: true, // enable injecting css
    navigate: true, // enable auto-navigation
}
