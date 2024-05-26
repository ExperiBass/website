const handlebars = require('handlebars')
const { readFileSync, writeFileSync, readdirSync } = require('node:fs')
const { join } = require('node:path')
const galleries = require('./galleries.js')
const thisDomain = 'https://experibassmusic.eth.limo'

handlebars.registerHelper('populategallery', (gallery) => {
    let galleryHTML = ''
    for (const img of gallery.images) {
        const src = `${gallery.tld}${img.url}`
        let source = img.credits ?? 'source unknown'
        if (img.sourceURL) {
            if (img.sourceURL.startsWith('https')) {
                source = `<a href="${img.sourceURL}">${img.credits || 'source'}</a>`
            }
        }
        galleryHTML +=
            '<div class="img-container">' +
            `<a href="${src}">` +
            `<img src="${src}" />` + /// loading="lazy" ?
            '</a>' +
            (img.desc ? `<p class="img-desc">${img.desc} [${source}]</p>` : '') +
            '</div>\n'
    }
    return galleryHTML.trim()
})
handlebars.registerHelper('link', (text, url) => {
    if (this.url) {
        text = this.text
        url = this.url
    }
    let target = '_blank'
    if (url.startsWith(thisDomain)) {
        target = ''
    }
    return `[<a href="${url}" target="${target}">${text}</a>]`
})

process.chdir(__dirname)

const siteDir = join(__dirname, `./site`)
const viewsDir = join(siteDir, './views')
const layoutFileName = 'layout.handlebars'
const LAYOUT_FILE = readFileSync(`${viewsDir}/${layoutFileName}`, 'utf-8')
const LAYOUT = handlebars.compile(LAYOUT_FILE)

const DRY_RUN = false

const ctx = {
    index: {
        tabtitle: 'Ｔａｎｄｅｍ　ｖｕｌｐｅｓ　ｖｏｃｅｍ　ｓｕａｍ　ｒｅｐｅｒｉｅｔ．',
        desc: 'Stinky Lostkin has Claimed a Corner of the Internet',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="/src/styles/webrings.css" />'],
        keywords: [],
    },
    term: {
        tabtitle: 'Ｔａｎｄｅｍ　ｖｕｌｐｅｓ　ｖｏｃｅｍ　ｓｕａｍ　ｒｅｐｅｒｉｅｔ．',
        desc: 'Stinky Lostkin has Claimed a Corner of the Internet',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="/src/styles/main-term.css" />'],
        keywords: [],
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
        keywords: ['cyberspace', 'independence'],
    },
    pixelsorts: {
        tabtitle: 'Pixels Placed in (Dis)Order',
        desc: 'organic Home-grown free-range pixelsorts',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="/src/styles/gallery.css" />'],
        galleryImages: galleries.pixelsorts,
        keywords: ['pixelsorting', 'pixelsort', 'glitch', 'art'],
    },
    eve: {
        tabtitle: 'Screenshots in Space',
        desc: "When i'm not dyin, i'm killin\nand then dyin",
        stylesheets: ['<link rel="stylesheet" type="text/css" href="/src/styles/gallery.css" />'],
        galleryImages: galleries.eve,
        keywords: ['eve', 'online', 'screenshots'],
    },
    flags: {
        tabtitle: 'Unified-pride-flags Flag Previews',
        desc: 'Previews of the flags included in unified-pride-flags.',
        author: '@KonkenBonken, @ExperiBass (GitHub)',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="/src/styles/flags.css" />'],
        keywords: ['unified', 'cli', 'pride', 'flags', 'lgbtqia'],
    },
    404: {
        tabtitle: 'Are You Lost? (404)',
    },
    rinkucomms: {
        tabtitle: 'Rinku Inku Commission Sheet',
        desc: "Rinku Inku's commission sheet.",
        author: 'Rinku Inku',
        themecolor: '#93E9BE',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="/src/styles/rinku.css" />'],
        keywords: [],
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
    let stylesheets = ['<link rel="stylesheet" type="text/css" href="/src/styles/main.css" />']
    if (extra.stylesheets) {
        stylesheets.push(...extra.stylesheets)
    }
    extra.stylesheets = stylesheets.join('')
    let keywords = ['experibassmusic', 'experibassmusic.eth.limo', 'web3']
    if (extra.keywords) {
        keywords.push(...extra.keywords)
    }
    extra.keywords = keywords

    const body = handlebars.compile(template)

    return {
        name: extra.page,
        content: LAYOUT({ body: body(extra), ...extra }),
    }
}

const pages = readdirSync(viewsDir)

for (const page of pages) {
    if (page === layoutFileName) {
        continue
    }
    console.log(page)
    const compiled = compileToHTML(page)
    try {
        if (!DRY_RUN) {
            writeFileSync(`${siteDir}/${compiled.name}`, compiled.content)
        }
    } catch (e) {
        fatalError(e)
    }
}

function fatalError(e) {
    console.error(e)
    process.exit(1)
}
