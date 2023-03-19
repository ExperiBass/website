class Autosuggest {
    #elm = null

    #suggestions = []
    #lastSuggestion = ""
    #lastPosition = 0

    constructor(elm, suggestions) {
        this.#elm = elm
        this.#suggestions = suggestions
        this.#elm.addEventListener("keydown", (ev) => this.#keyDown(ev))
        this.#elm.addEventListener("keyup", (ev) => this.#onInput(ev))
        this.#elm.focus()
    }
    #onInput(ev) {
        ev.preventDefault()
        const cleanedInput = this.#elm.innerText.replace(/(\n|\r|\t)/ig, "")

        if (!ev.key.match(/^[\w\d `~!@#$%^&*\(\)_\-+=\{\}\[\]|\/,.:;"']$/) && !ev.key.match(/(Backspace|Delete)/i)) {
            return
        }

        // ignore select/copy/paste
        if (ev.key.match(/^(a|c|v)$/) && ev.ctrlKey) {
            return
        }
        // ignore only meta presses
        if (ev.key.match(/(Control|Shift|Alt|OS)/i)) {
            console.log('returned')
            return
        }

        const { input, suggestions } = this.#suggest(cleanedInput)
        this.#lastPosition = this.#getCaretPosition()

        if (suggestions.length > 0) {
            const firstSuggestion = suggestions[0].replace(input, "")
            this.#elm.innerHTML = `${input}<i style="color:#444">${firstSuggestion}</i>`

            this.#lastSuggestion = firstSuggestion
        } else {
            this.#elm.innerText = input // clear
        }
        // call cleanup method
        this.#afterInput(ev, input, suggestions)
    }
    #keyDown(ev) {
        if (ev.key.match(/(Control|Shift|Alt|OS)/i)) {
            return
        }
        // set cursor to last known pos
        this.#positionCaret(this.#lastPosition)

        if (ev.key === "Tab") {
            ev.preventDefault()
            this.#elm.innerText = this.#elm.innerText // remove the formatting
            this.#lastSuggestion = "" // clear suggestion
            this.#lastPosition = this.#getCaretPosition() // save cursor position
            this.#positionCaret() // and move the cursor to the end
            return
        }
    }
    #afterInput(ev, input, suggestions) {
        // remove <br> that ff inserts
        const lastNode = [...this.#elm.childNodes].pop()
        if (lastNode && lastNode.tagName == "BR") {
            this.#elm.removeChild(lastNode)
        }
        // reset cursor
        if (this.#elm.childNodes && this.#elm.childNodes[0]) {
            try {
                this.#positionCaret(this.#lastPosition)
            } catch (e) {
                console.error(e)
                this.#positionCaret()
            }
        }

        // WANTED: command coloring
    }
    #suggest(text) {
        const userInput = text.replace(this.#lastSuggestion, "")
        if (userInput === "") {
            return { input: "", suggestions: [] }
        }
        const results = this.#suggestions.filter(v => v === userInput || v.startsWith(userInput))
        return {
            input: userInput,
            suggestions: results
        }
    }
    // from https://www.geeksforgeeks.org/how-to-set-cursor-position-in-content-editable-element-using-javascript/
    #positionCaret(pos) {
        const tag = this.#elm

        if (!tag.childNodes || !tag.childNodes[0]) {
            return
        }
        if (!pos) {
            pos = tag.childNodes[0].length
        }

        const setpos = document.createRange()
        const set = window.getSelection()

        try {
            setpos.setStart(tag.childNodes[0], pos)
        } catch (e) {
            console.error(e)
            setpos.setStart(tag.childNodes[0], tag.childNodes[0].length)
        }
        setpos.collapse(true)
        set.removeAllRanges()
        set.addRange(setpos)
        tag.focus()
    }
    // https://stackoverflow.com/a/46902361
    #getCaretPosition() {
        let range = window.getSelection().getRangeAt(0),
            preCaretRange = range.cloneRange(),
            caretPosition,
            tmp = document.createElement("div")

        preCaretRange.selectNodeContents(this.#elm)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        tmp.appendChild(preCaretRange.cloneContents())
        caretPosition = tmp.innerText.length
        return caretPosition
    }
    // https://stackoverflow.com/a/32809957
    stop() {
        this.#elm.outerHTML = this.#elm.outerHTML
    }
}