function addBlankToLinks() {
    const links = document.getElementsByTagName('a')
    const thisDomain = `${window.location.protocol}//${window.location.host}`
    for (const link of links) {
        if (!link.href.startsWith(thisDomain)) {
            link.target = "_blank" // open external links in a new tab
        }
    }
}

function getAllTextElems() {
    // not really *all* text elms, but the ones used on this site lol
    const textElems = [].concat(Array.from(document.getElementsByTagName("p")),
        Array.from(document.getElementsByTagName("span")),
        Array.from(document.getElementsByTagName("a")),
        Array.from(document.getElementsByTagName("h1")),
        Array.from(document.getElementsByTagName("h2")),
        Array.from(document.getElementsByTagName("h3")),
        Array.from(document.getElementsByTagName("pre"))).flat()
    return textElems
}

function italiciseText() {
    const ITALIC_REGEX = /\*(.+)\*/ig

    for (const elm of getAllTextElems()) {
        elm.innerHTML = elm.innerHTML.replace(ITALIC_REGEX, (_, p1) => {
            return `<i>${p1}</i>`
        })
    }
}

async function copy(elm) {
    if (!elm) {
        return alert("The element to copy doesn't exist.")
    }
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(elm.innerText)
        return
    } else {
        return alert("Your browser doesn't support the Clipboard API!")
    }
}

function replaceEmotes() {
    const emotes = [
        'GingBlep.png',
        'GingCri.png',
        'GingHappy.png',
        'GingkaCreep.png',
        'owo.gif',
        'eos.png'
    ]
    const emoteRegex = /:([\w_-])+:/ig // matches text between two colons (but not numbers)
    const dims = 15
    // abusing img tags, fun!
    const emoteTemplate = `<img width="${dims}px" height="${dims}px" class="emote" title="TITLE" src="src/images/emotes/EMOTE" />`

    // start processing emotes
    for (const elem of getAllTextElems()) {
        const matches = elem.innerHTML.match(emoteRegex)

        if (!matches) {
            continue
        }
        for (const match of matches) {
            const emoteName = match.slice(1, -1)
            const emote = emotes.filter((v) => v.startsWith(`${emoteName}.`))
            const img = emoteTemplate.replace("EMOTE", emote).replace("TITLE", emoteName) // replace the placeholders with their contents
            elem.innerHTML = elem.innerHTML.replace(match, img)
        }
    }
}