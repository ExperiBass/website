const handlebars = require('handlebars')
const { readFileSync, writeFileSync, readdirSync, mkdirSync } = require('node:fs')
const { join } = require('node:path')
const { execSync } = require('node:child_process')

/// TODO
/// compile views dir
process.chdir(__dirname)
const commitHash = execSync('git rev-parse HEAD | head -c 7')
const viewsDir = join(__dirname, './views')
const outDir = join(__dirname, `./.out/${commitHash}`)
const layoutFileName = 'layout.handlebars'
const LAYOUT_FILE = readFileSync(`${viewsDir}/${layoutFileName}`, 'utf-8')
const LAYOUT = handlebars.compile(LAYOUT_FILE)
const ctx = {
    index: {
        tabtitle: 'Ｔａｎｄｅｍ　ｖｕｌｐｅｓ　ｖｏｃｅｍ　ｓｕａｍ　ｒｅｐｅｒｉｅｔ．',
        desc: 'Stinky Foxxo Does Things',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="src/styles/webrings.css" />'],
    },
    term: {
        tabtitle: 'Ｔａｎｄｅｍ　ｖｕｌｐｅｓ　ｖｏｃｅｍ　ｓｕａｍ　ｒｅｐｅｒｉｅｔ．',
        desc: 'Stinky Foxxo Does Things',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="src/styles/main-term.css" />'],
    },
    'cyberspace-independence': {
        tabtitle: 'A Declaration of the Independence of Cyberspace',
        desc:
            '"A Declaration of the Independence of Cyberspace" is a widely distributed early paper ' +
            'on the applicability (or lack thereof) of government to the rapidly growing Internet. ' +
            'Commissioned for the pioneering Internet project 24 Hours in Cyberspace, ' +
            'it was written by John Perry Barlow, a founder of the Electronic Frontier Foundation, ' +
            'and published online on February 8, 1996, from Davos, Switzerland.',
        author: 'John Perry Barlow',
    },
    pixelsorts: {
        tabtitle: '',
        description: 'Glitched Images',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="src/styles/gallery.css" />'],
    },
    eve: {
        tabtitle: 'Gings EvE Photo Gallery',
        description: 'Gings EvE Online screenshots.',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="src/styles/gallery.css" />'],
    },
    flags: {
        tabtitle: 'Unified-pride-flags Flag Previews',
        description: 'Previews of the flags included in unified-pride-flags.',
        author: '@KonkenBonken, @ExperiBass (GitHub)',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="src/styles/flags.css" />'],
    },
    404: {
        tabtitle: 'Are You Lost? (404)',
    },
    rinkucomms: {
        tabtitle: 'Rinku Inku Commission Sheet',
        description: "Rinku Inku's commission sheet.",
        author: 'Rinku Inku',
        themecolor: '#93E9BE',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="src/styles/rinku.css" />'],
    },
}
function compileToHTML(page) {
    const template = readFileSync(`${viewsDir}/${page}`, 'utf-8')
    const templateName = page.split('.')[0]
    const extra = {
        page: `${templateName}.html`,
        ...ctx[templateName],
    }
    extra.themecolor = extra.themecolor || '#5bbad5'
    extra.author = extra.author || 'ΞXPΞRIBΛSS'
    let stylesheets = ['<link rel="stylesheet" type="text/css" href="src/styles/main.css" />']
    if (extra.stylesheets) {
        stylesheets.push(...extra.stylesheets)
    }
    extra.stylesheets = stylesheets.join('')

    const body = handlebars.compile(template)

    return {
        name: extra.page,
        content: LAYOUT({ body: body(extra), ...extra }),
    }
}
// console.log(compileToHTML('./views/index.handlebars'))

const pages = readdirSync(viewsDir)

try {
    //mkdirSync(outDir)
} catch (e) {
    fatalError(e)
}

for (const page of pages) {
    if (page === layoutFileName) {
        continue
    }
    console.log(page)
    const compiled = compileToHTML(page)
    //console.log(compiled.content)
    try {
        //writeFileSync(`${outDir}/${compiled.name}`, compiled.content)
    } catch (e) {
        fatalError(e)
    }
}

function fatalError(e) {
    console.error(e)
    process.exit(1)
}
