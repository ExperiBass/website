const handlebars = require('handlebars')
const {readFileSync, writeFileSync} = require('node:fs')
const {join} = require('node:path')


const LAYOUT_FILE = readFileSync(join(__dirname, './views/layout.handlebars'), 'utf-8')
const LAYOUT = handlebars.compile(LAYOUT_FILE)
const ctx = {
    "index": {
        tabtitle: "Ｔａｎｄｅｍ　ｖｕｌｐｅｓ　ｖｏｃｅｍ　ｓｕａｍ　ｒｅｐｅｒｉｅｔ．"
    }
}
function compileToHTML(path) {
    const template = readFileSync(join(__dirname, path), 'utf-8')
    const templateName = path.split('/')?.reverse()[0]?.split('.')[0]
    const ctx = {
        tabtitle: ,
        page: `${templateName}.html`
    }

    const body = handlebars.compile(template)

    return LAYOUT({body: body(ctx[templateName]), ...ctx[templateName]})
}

console.log(compileToHTML('./views/index.handlebars'))