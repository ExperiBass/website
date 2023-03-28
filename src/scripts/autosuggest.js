class Autosuggest {
    #inputElm = null
    #completionElm = null

    #suggestions = []
    #lastSuggestion = ""
    #lastPosition = 0

    constructor(inputElm, completionElm, suggestions) {
        this.#inputElm = inputElm
        this.#completionElm = completionElm
        this.#suggestions = suggestions
        this.#inputElm.addEventListener("keydown", (ev) => this.#keyDown(ev))
        this.#inputElm.addEventListener("keyup", (ev) => this.#onInput(ev))
    }
    #onInput(ev) {
        ev.preventDefault()

        if (!ev.key.match(/^[\w\d `~!@#$%^&*\(\)_\-+=\{\}\[\]|\/,.:;"']$/)
            && !ev.key.match(/(Backspace|Delete)/i)) {
            return
        }

        // ignore select/copy/paste
        if (ev.key.match(/^(a|c|v)$/) && ev.ctrlKey) {
            return
        }
        // ignore only meta presses
        if (ev.key.match(/(Control|Shift|Alt|OS)/i)) {
            return
        }

        const cleanedInput = this.#inputElm.innerText.replace(/(\n|\r|\t)/ig, "")
        if (cleanedInput === "") {
            this.#lastSuggestion = ""
            this.#completionElm.innerText = ""
            return
        }
        const { input, suggestions } = this.#suggest(cleanedInput)
        this.#lastPosition = this.#getCaretPosition()

        if (suggestions.length > 0) {
            const firstSuggestion = suggestions[0].replace(input, "")
            this.#completionElm.innerText = `${firstSuggestion}`

            if (input === "") {
                this.#lastSuggestion = ""
            } else {
                this.#lastSuggestion = suggestions[0]
            }
        } else {
            this.#completionElm.innerText = "" // clear
        }
        // call cleanup method
        this.#afterInput(ev, input, suggestions)
    }
    #keyDown(ev) {
        if (ev.key.match(/(Control|Shift|Alt|OS)/i)) {
            return
        }
        if (ev.key === "a" && ev.ctrlKey) {
            ev.preventDefault()
            return // no selecting here baby
        }

        if (ev.key === "Enter") {
            ev.preventDefault()
            return
        }

        if (ev.key === "Tab") {
            ev.preventDefault()
            const completedText = `${this.#inputElm.innerText}${this.#completionElm.innerText}`
            this.#completionElm.innerText = "" // clear completion
            this.#inputElm.innerText = completedText
            this.#lastSuggestion = "" // clear suggestion
            this.#lastPosition = this.#getCaretPosition() // save cursor position
            this.#positionCaret() // and move the cursor to the end
            return
        }
    }
    #afterInput(ev, input, suggestions) {
        // remove <br> that ff inserts
        for (const node of this.#inputElm.childNodes) {
            if (node && node.tagName == "BR") {
                this.#inputElm.removeChild(node)
            }
        }
        // reset cursor
        /*if (this.#inputElm.childNodes && this.#inputElm.childNodes[0]) {
            try {
                this.#positionCaret(this.#lastPosition)
            } catch (e) {
                console.error(e)
                this.#positionCaret()
            }
        }*/

        // WANTED: command coloring
    }
    #suggest(text) {
        let userInput
        if (text !== this.#lastSuggestion) {
            userInput = text
        } else {
            userInput = text.replace(this.#lastSuggestion, "")
        }
        if (userInput === "") {
            return {
                input: userInput,
                suggestions: []
            }
        }
        const results = this.#suggestions.filter(v => v === userInput || v.startsWith(userInput))
        return {
            input: userInput,
            suggestions: results
        }
    }
    // from https://www.geeksforgeeks.org/how-to-set-cursor-position-in-content-editable-element-using-javascript/
    #positionCaret(pos) {
        const tag = this.#inputElm

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

        preCaretRange.selectNodeContents(this.#inputElm)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        tmp.appendChild(preCaretRange.cloneContents())
        caretPosition = tmp.innerText.length
        return caretPosition
    }
    // https://stackoverflow.com/a/32809957
    stop() {
        this.#inputElm.outerHTML = this.#inputElm.outerHTML
    }
}