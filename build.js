const handlebars = require('handlebars')
const { readFileSync, writeFileSync, readdirSync } = require('node:fs')
const { join } = require('node:path')

/// TODO
/// compile views dir

const LAYOUT_FILE = readFileSync(join(__dirname, './views/layout.handlebars'), 'utf-8')
const LAYOUT = handlebars.compile(LAYOUT_FILE)
const ctx = {
    index: {
        tabtitle: 'Ｔａｎｄｅｍ　ｖｕｌｐｅｓ　ｖｏｃｅｍ　ｓｕａｍ　ｒｅｐｅｒｉｅｔ．',
        desc: 'Stinky Foxxo Does Things',
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
}
function compileToHTML(path) {
    const template = readFileSync(join(__dirname, path), 'utf-8')
    const templateName = path.split('/')?.reverse()[0]?.split('.')[0]
    const extra = {
        page: `${templateName}.html`,
        ...ctx[templateName],
    }
    extra.author = extra.author || 'Gïng Pepper'
    extra.stylesheets = extra.stylesheets || '<link rel="stylesheet" type="text/css" href="src/styles/main.css" />'

    const body = handlebars.compile(template)

    return LAYOUT({ body: body(...extra), ...extra })
}

console.log(compileToHTML('./views/index.handlebars'))
