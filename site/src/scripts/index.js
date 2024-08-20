const pane = document.getElementById('pane')
const panecmd = document.getElementById('panecmd')
const menu = document.getElementById('menu')
let activePane = 'loading'
/**
 *
 * @param {MouseEvent|KeyboardEvent} ev
 */
const menuAction = (ev) => {
    const box = document.getElementById('dropdownlow')
    const elm = ev.target
    const section = elm.attributes.page?.value

    if (ev?.key) {
        if (ev.key === 'ArrowUp') {
            ev.preventDefault()
            if (elm.previousElementSibling) {
                elm.previousElementSibling.focus()
            } else {
                elm.parentElement.lastElementChild.focus()
            }
            return
        }
        if (ev.key === 'ArrowDown') {
            ev.preventDefault()
            if (elm.nextElementSibling) {
                elm.nextElementSibling.focus()
            } else {
                elm.parentElement.firstElementChild.focus()
            }
            return
        }

        // unfocus
        if (ev.key === 'ArrowRight') {
            ev.preventDefault()
            pane.focus()
            return
        }
        if (ev.key === 'Escape') {
            ev.preventDefault()
            elm.blur()
            return
        }
        // ignore everything else
        if (ev.key !== 'Enter') {
            return
        }
    }

    if (!section) {
        return
    }
    if (activePane) {
        /// TODO: store elements?
        document.getElementById(activePane).className = 'hidden'
    }
    document.getElementById(section).className = ''
    activePane = section
    panecmd.innerText = section
    //pane.innerHTML = sections[section]
    box.checked ? (box.checked = false) : null

    // re-exec emote and link funcs on change
    addBlankToLinks()
    //italiciseText()
    replaceEmotes()
}
const paneAction = (ev) => {
    if (ev?.key) {
        if (ev.key === 'ArrowLeft') {
            ev.preventDefault()
            console.log(ev)
            menu.firstElementChild.focus()
            return
        }
    }
}

function activateMenu() {
    const links = document.getElementsByClassName('menu-link')

    // apply input listener
    for (const link of links) {
        link.onclick = menuAction
        link.onkeydown = menuAction
    }
    pane.onkeydown = paneAction
    // load default panel
    menuAction({ target: { attributes: { page: { value: 'aboutme' } } } })
    links[0].focus()
}

/// ok now do the thing
try {
    addBlankToLinks()
    activateMenu()
} catch (e) {
    pane.innerText = errorCleaner(e)
}
