class Terminal {
    #root = null
    #commands = {
        "echo": {
            execute({args}) {
                if (args[0].match(/(--help|-h)/)) {
                    return `<span style="color:lime;">echo</span> <span style="color:yellow">[string]...</span>`
                }
                return args.join(" ")
            }
        },
        "help": {
            execute({args}) {
                return `Commands:\n${Object.keys(this.getCommands()).join(", ")}`
            }
        }
    }
    constructor(rootElm) {
        this.#root = rootElm
        this.#createPrompt()
    }
    #createPrompt() {
        const promptDiv = document.createElement('div')
        promptDiv.className = "promptdiv"
        // create prompt
        const prompt = document.createElement('span')
        prompt.innerHTML = `<span class="promptbrace">(</span><span class="promptuser">guest</span><span class="promptbrace">)</span> $`
        prompt.className = "prompt"
        // create input span
        const promptInput = document.createElement('span')
        promptInput.id = "activeprompt"
        promptInput.className = "promptinput"
        promptInput.spellcheck = false
        promptInput.contentEditable = true
        promptInput.addEventListener("keydown", (ev) => this.#keyDown(ev))
        promptDiv.appendChild(prompt)
        promptDiv.appendChild(promptInput)
        promptInput._suggest = new Autosuggest(promptInput, ["echo", "echo --help", "help", "info"])

        this.#root.append(promptDiv)
        setTimeout(() => {
            promptInput.focus()
        },0)
    }
    #lockPrompt(prompt) {
        prompt.id = "" // unset id so next prompt can be used
        prompt.contentEditable = false
        prompt.outerHTML = prompt.outerHTML
        prompt._suggest.stop() // gotta stop this last or the prompt will still be enabled
    }
    #keyDown(ev) {
        const currPrompt = ev.currentTarget
        if (ev.key === "Enter") {
            ev.preventDefault()
            this.#lockPrompt(currPrompt)
            this.#handleCommand(currPrompt.innerText)
            // spawn new prompt
            this.#createPrompt()
            return
        }
    }
    #handleCommand(input) {
        const inputArray = input.split(" ")
        const potentialCommand = inputArray.shift()
        if (this.#commands[potentialCommand]
            && this.#commands[potentialCommand].execute) {

            const output = this.#commands[potentialCommand].execute({args:inputArray})
            this.#createOutput(output)
        } else {
            this.#createOutput(`foxsh: ${potentialCommand}: command not found`)
        }
    }
    #createOutput(outputHTML) {
        const container = document.createElement('div')
        container.className = "promptdiv"
        const outputSpan = document.createElement('span')
        outputSpan.className = "output"
        outputSpan.innerHTML = outputHTML

        container.appendChild(outputSpan)
        this.#root.append(container)
    }
}