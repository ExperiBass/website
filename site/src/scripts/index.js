/**
 *
 * @param {MouseEvent|KeyboardEvent} ev
 */
const menuAction = (ev) => {
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

        // TODO: arrow left/right to move from menu to infopanel and back

        // unfocus
        if (ev.key === 'Escape') {
            ev.preventDefault()
            elm.blur()
        }

        if (ev.key === 'Tab') {
            ev.preventDefault()
            elm.blur()
        }
        // ignore everything else
        if (ev.key !== 'Enter') {
            return
        }
    }

    if (!section) {
        return
    }
    const pane = document.getElementById('pane')
    const box = document.getElementById('dropdownlow')
    pane.innerHTML = sections[section]
    box.checked ? (box.checked = false) : null

    // re-exec emote and link funcs on change
    addBlankToLinks()
    //italiciseText()
    replaceEmotes()
}

function activateMenu() {
    const links = document.getElementsByClassName('menu-link')

    // apply input listener
    for (const link of links) {
        link.onclick = menuAction
        link.onkeydown = menuAction
    }
    // load default panel
    menuAction({ target: { attributes: { page: { value: 'aboutme' } } } })
    links[0].focus()
}

/// ok now do the thing
try {
    addBlankToLinks()
    activateMenu()
} catch (e) {
    const pane = document.getElementById('pane')
    pane.innerText = errorCleaner(e)
}
