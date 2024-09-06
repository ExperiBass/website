const handlebars = require('handlebars')
const { readFileSync, writeFileSync, readdirSync } = require('node:fs')
const { join } = require('node:path')
const galleries = require('./galleries.js')
const thisDomain = 'https://experibassmusic.eth.limo'

const wrappedLinkHelper = (text, url) => {
    let target = ''
    if (url.startsWith('https://') && !url.startsWith(thisDomain)) {
        target = '_blank' // open external links in a new tab
    }

    
    return `&#xe007;<a href="${url}" target="${target}">${text}</a>&#xe008;`
}
const prefixedLinkHelper = (text, url) => {
    let target = ''
    let prefix = '//'
    if (url.startsWith('https://') && !url.startsWith(thisDomain)) {
        target = '_blank' // open external links in a new tab
        //prefix += '/'
    }
    return `<a href="${url}" target="${target}">${prefix}${text}</a>`
}
handlebars.registerHelper('populategallery', (gallery) => {
    let galleryHTML = ''
    for (const img of gallery.images) {
        const src = `${gallery.tld}${img.url}`
        /// usse the image path without the file ext as the id
        const divID = img.url.split('.').reverse().slice(1).join('.')
        let source = `&#xe007;${img.credits || 'source unknown'}&#xe008;`
        if (img.sourceURL) {
            if (img.sourceURL.startsWith('https')) {
                source = wrappedLinkHelper(img.credits || 'source', img.sourceURL)
            }
        }
        galleryHTML +=
            `<div class="img-container" id="${divID}">` +
            `<a href="${src}">` +
            `<img src="${src}"/>` +
            '</a>' +
            (img.desc ? `<p class="img-desc">${img.desc} ${source}</p>` : '') +
            '</div>\n'
    }
    return galleryHTML.trim()
})
handlebars.registerHelper('wrappedlink', wrappedLinkHelper)
handlebars.registerHelper('hyperlink', prefixedLinkHelper)
handlebars.registerHelper('header', (maintext, subtext) => {
    if (typeof subtext === 'string') {
        subtext = subtext.trim().replace(/\\n/g, '<br>')
    }
    maintext = maintext.trim().replace(/\\n/g, '<br>')
    return `
    <div id='header'>
    <div>
        <h1>${handlebars.compile(maintext)()}</h1>
        ${typeof subtext === 'string' ? `<h2>${handlebars.compile(subtext)()}</h2>` : ''}
    </div>
    <hr />
    </div>
    `.trim()
})
handlebars.registerHelper('pawprint', () => {
    return pawprint
        .split(' ')
        .map((chunk, i) => `<span>${chunk}</span>${(i + 1) % 5 ? '' : '<br />'}`)
        .join(' ')
})
handlebars.registerHelper('cursorblink', () => {
    return "<span class='cursor-blink'>&#xe006;</span>"
})

process.chdir(__dirname)

const siteDir = join(__dirname, `./site`)
const viewsDir = join(siteDir, './src/views')
const layoutFileName = 'layout.handlebars'
const LAYOUT_FILE = readFileSync(`${viewsDir}/${layoutFileName}`, 'utf-8')
const LAYOUT = handlebars.compile(LAYOUT_FILE)
const pawprint = '33A8 1E0A 9FD6 6E1B 5D02 7649 5F47 E26A 5D22 1AEC'

const DRY_RUN = false

const ctx = {
    index: {
        tabtitle: 'Ｔａｎｄｅｍ　ｖｕｌｐｅｓ　ｖｏｃｅｍ　ｓｕａｍ　ｒｅｐｅｒｉｅｔ．',
        desc: 'Stinky Lostkin has Claimed a Corner of the Internet',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="/src/styles/webrings.css" />'],
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
        image: 'https://foxuments.experibassmusic.eth.limo/pixelsort-gens/misc/lakepadden-sorted.png',
        imageDims: { width: 1920, height: 1080 },
    },
    eve: {
        tabtitle: 'Screenshots in Space',
        desc: "When i'm not dyin, i'm killin\nand then dyin",
        stylesheets: ['<link rel="stylesheet" type="text/css" href="/src/styles/gallery.css" />'],
        galleryImages: galleries.eve,
        keywords: ['eve', 'online', 'screenshots'],
        image: '',
    },
    flags: {
        tabtitle: 'Unified-pride-flags Flag Previews',
        desc: 'Previews of the flags included in unified-pride-flags.',
        author: '@KonkenBonken, @ExperiBass (GitHub)',
        stylesheets: ['<link rel="stylesheet" type="text/css" href="/src/styles/flags.css" />'],
        keywords: ['unified', 'cli', 'pride', 'flags', 'lgbtqia'],
    },
    404: { tabtitle: 'Are You Lost? (404)', desc: 'Were you even Found?' },
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
    extra.themecolor = extra.themecolor || '#262640'
    extra.author = extra.author || 'ΞXPΞRIBΛSS'
    let stylesheets = ['<link rel="stylesheet" type="text/css" href="/src/styles/main.css" />']
    if (extra.stylesheets) {
        stylesheets.push(...extra.stylesheets)
    }
    extra.stylesheets = stylesheets.join('')
    let keywords = ['⎇', 'ΘΔ', 'experibassmusic', 'experibassmusic.eth.limo',
        'web3', 'ens', 'alterbeing', 'nonhuman', 'assegai', 'cypherpunk']
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

for (const page of pages.filter((v) => v.endsWith('.handlebars'))) {
    if ([layoutFileName, 'menus.handlebars'].includes(page)) {
        continue
    }
    const compiled = compileToHTML(page)
    try {
        if (!DRY_RUN) {
            writeFileSync(`${siteDir}/${compiled.name}`, compiled.content)
        }
        console.log(page)
    } catch (e) {
        fatalError(e)
    }
}

function fatalError(e) {
    console.error(e)
    process.exit(1)
}
