const emotes = [
    'GingBlep.png',
    'GingCri.png',
    'GingHappy.png',
    'GingkaCreep.png',
    'owo.gif',
    'eos.png'
]
const emoteRegex = /:([\w_-])+:/ig // matches text between two colons (but not numbers)
const emoteDims = 15

// functions
function addBlankToLinks() {
    const links = document.getElementsByTagName('a')
    const thisDomain = `${window.location.protocol}//${window.location.host}`
    for (const a of links) {
        // todo: make better lol
        /*if (!a.innerHTML.includes('<img')) {
            a.innerHTML = a.innerHTML.trim() + `<span class="blink">_</span>`
        }*/
        if (!a.href.startsWith(thisDomain)) {
            a.target = "_blank" // open external links in a new tab
        }
    }
}

function getAllTextElms() {
    // not really *all* text elms, but the ones used on this site lol
    if (window._gingTextElems) {
        return window._gingTextElems
    }
    const textElems = [...document.getElementsByTagName("p"),
        ...document.getElementsByTagName("span"),
        ...document.getElementsByTagName("a"),
        ...document.getElementsByTagName("h1"),
        ...document.getElementsByTagName("h2"),
        ...document.getElementsByTagName("h3"),
        ...document.getElementsByTagName("pre")]
    window._gingTextElems = textElems
    return textElems
}

function italiciseText() {
    const ITALIC_REGEX = /\*(.+)\*/ig

    for (const elm of getAllTextElms()) {
        elm.innerHTML = elm.innerHTML.replace(ITALIC_REGEX, (_, p1) => {
            return `<i>${p1}</i>`
        })
    }
}

async function copy(elm, config) {
    if (!elm) {
        return alert("The element to copy doesn't exist.")
    }
    if (navigator.clipboard) {
        let text = elm.innerText
        if (config.trimNewlines) {
            text = text.replace('\n', ' ')
        }
        await navigator.clipboard.writeText(text)
        return
    } else {
        return alert("Your browser doesn't support the Clipboard API!")
    }
}

function replaceEmotes() {
    // start processing emotes
    for (const elm of getAllTextElms()) {
        replaceEmotesInElm(elm)
    }
}

function replaceEmotesInElm(elm) {
    const matches = elm.innerHTML.match(emoteRegex)

    if (!matches) {
        return
    }
    // abusing img tags, fun!
    const emoteTemplate = `<img width="${emoteDims}px" height="${emoteDims}px" class="emote" alt=":TITLE:" src="src/images/emotes/EMOTE" />`
    for (const match of matches) {
        const emoteName = match.slice(1, -1) // trim :
        const emote = emotes.filter((v) => v.startsWith(`${emoteName}.`)) // be sure its actually an emote
        const img = emoteTemplate.replace("EMOTE", emote).replace("TITLE", emoteName) // replace the placeholders with their contents
        elm.innerHTML = elm.innerHTML.replace(match, img)
    }
}


// MAYBE: display different messages for ipfs and clearnet?
function checkDomain() {
    const url = window.location

    if (url.protocol === "ipfs:") {

    }
}