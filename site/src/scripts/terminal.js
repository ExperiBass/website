function findCommandFromAlias(alias, commands) {
    for (const [name, value] of commands.entries()) {
        if (value.aliases && value.aliases.includes(alias)) {
            return name
        }
    }
    
    return undefined
}
function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
}
const pawprint = "33A8 1E0A 9FD6 6E1B 5D02 7649 5F47 E26A 5D22 1AEC"
const alert = (msg) => { return msg } // override global alert(), terminals dont have such posh features

class Terminal {
    #root = null
    #motd = `Confused? Run "<span class="blinking">help</span>"!<br>This terminal has tab completion!<br>Not working? <a href="/">Head to the main page!</a>`
    #completion = ["echo", "help", "info"]
    #commandsDef = {
        "echo": {
            description: 'Echoes you.',
            async execute({ args }) {
                return args.join(" ")
            },
            completion: "$name (--help|-h)"
        },
        "help": {
            description: 'What else?',
            async execute({ classThis, args }) {
                if (!args[0]) {
                    let helpText = ""
                    helpText += `Commands:\n${[...classThis.#commands.keys()].sort().join(", ")}`
                    return helpText
                }
                const command = classThis.#commands.get(args[0]) ?? classThis.#commands.get(findCommandFromAlias(args[0], classThis.#commands))
                if (!command) {
                    return `foxsh: Yip! command "${args[0]}" not found.`
                }
                return `${command.description || ''}\nAliases: ${command.aliases || 'none'}`
            },
            aliases: ['commands', '?']
        },
        "foxfetch": {
            description: 'obligatory neofetch',
            async execute() {
                let output =
                    `⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   guest@experibassmusic.eth
                ⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   -----------
                ⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   OS: FoxOS
                ⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠆⠜⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   Host: ${window.location.hostname}
                ⣿⣿⣿⣿⠿⠿⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿   Kernel: 6.2.1-fox
                ⣿⣿⡏⠁⠀⠀⠀⠀⠀⣀⣠⣤⣤⣶⣶⣶⣶⣶⣦⣤⡄⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿   Uptime: ∞
                ⣿⣿⣷⣄⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⡧⠇⢀⣤⣶⣿⣿⣿⣿⣿⣿⣿   Packages: 926 (den)
                ⣿⣿⣿⣿⣿⣿⣾⣮⣭⣿⡻⣽⣒⠀⣤⣜⣭⠐⢐⣒⠢⢰⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿   Shell: foxsh
                ⣿⣿⣿⣿⣿⣿⣿⣏⣿⣿⣿⣿⣿⣿⡟⣾⣿⠂⢈⢿⣷⣞⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿   Resolution: ${window.innerWidth}x${window.innerHeight}
                ⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣷⣶⣾⡿⠿⣿⠗⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   WM: foxwm
                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠻⠋⠉⠑⠀⠀⢘⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   Terminal: foxterm
                ⣿⣿⣿⣿⣿⣿⣿⡿⠟⢹⣿⣿⡇⢀⣶⣶⠴⠶⠀⠀⢽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   CPU: Vulpera 9472S (32) @ 3.800THz
                ⣿⣿⣿⣿⣿⣿⡿⠀⠀⢸⣿⣿⠀⠀⠣⠀⠀⠀⠀⠀⡟⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   GPU: Zerda Floof E6
                ⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⠹⣿⣧⣀⠀⠀⠀⠀⡀⣴⠁⢘⡙⢿⣿⣿⣿⣿⣿⣿⣿⣿   Memory: 15MiB / 42069000MiB
                ⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⠗⠂⠄⠀⣴⡟⠀⠀⡃⠀⠉⠉⠟⡿⣿⣿⣿⣿
                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠾⠛⠂⢹⠀⠀⠀⢡⠀⠀⠀⠀⠀⠙⠛⠿⢿`
                return output
            },
            aliases: ['ff']
        },
        "clear": {
            description: 'Clear the screen.',
            async execute({ classThis }) {
                classThis.#root.innerHTML = ""
                return ""
            }
        },
        "copypawprint": {
            description: "Copies my PGP pawprint to your clipboard.",
            async execute() {
                const inviSpan = document.createElement('span')
                inviSpan.innerText = pawprint
                const output = await copy(inviSpan)
                inviSpan.remove()
                return output
            }
        },
    }
    #commands = null
    constructor(rootElm, motd) {
        this.#root = rootElm
        motd ? this.#motd = motd : ""

        for (const [k,v] of Object.entries(sections)) {
            console.log(k)
            this.#commandsDef[k] = {
                async execute() {
                    return v.replace(/\n/g, '')
                }
            }
        }
        this.#commands = new Map(Object.entries(this.#commandsDef))

        this.#start()
    }
    #start() {
        this.#buildCompletion()
        const MOTDElm = document.createElement('span')
        MOTDElm.innerHTML = this.#motd
        MOTDElm.id = "motd"
        // focus on the input when the page is clicked
        this.#root.addEventListener('click', () => {
            const activePrompt = document.getElementById('activeprompt')
            if (!document.activeElement || document.activeElement !== activePrompt) {
                this.#focusElm(activePrompt)
            }
        })
        this.#root.appendChild(MOTDElm)
        this.#createPrompt()
    }
    #buildCompletion() {
        let completions = []
        for (const [name, value] of this.#commands.entries()) {
            let foundCompletions = [name] // get the command name in
            if (value.aliases) {
                foundCompletions.push(...value.aliases)
            }
            completions.push(...foundCompletions)
        }
        this.#completion = completions
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
        // create completion span
        const inputCompletion = document.createElement('span')
        inputCompletion.id = "activepromptcompletion"
        promptDiv.appendChild(prompt)
        promptDiv.appendChild(promptInput)
        promptDiv.appendChild(inputCompletion)
        promptInput._suggest = new Autosuggest(promptInput, inputCompletion, this.#completion)

        this.#root.append(promptDiv)
        this.#focusElm(promptInput)
    }
    #lockPrompt(prompt) {
        prompt.id = "" // unset id so next prompt can be used
        prompt.contentEditable = false
        prompt.outerHTML = prompt.outerHTML // remove any listeners
        prompt._suggest.stop() // gotta stop this last or the prompt will still be enabled
    }
    async #keyDown(ev) {
        const currPrompt = ev.currentTarget

        if (ev.key === "Enter") {
            ev.preventDefault()
            this.#lockPrompt(currPrompt)
            try {
                await this.#handleCommand(currPrompt.innerText)
            } catch (e) {
                const errorMessage = `<span class="errname">${e.name}</span>:<br><span class="errmsg">${e.message}</span><br><p class="errstack">@${e.stack.replace(/\n/g, "<br>")}</p>`
                this.#createOutput(errorMessage)
            } finally {
                // spawn new prompt
                this.#createPrompt()
            }
            return
        }
    }
    #focusElm(elm) {
        return setTimeout(() => {
            elm.focus()
        }, 0)
    }
    async #handleCommand(input) {
        let inputArray = input.split(" ")
        if (!inputArray[0]) {
            return
        }

        const potentialCommand = inputArray.shift()
        const command = this.#commands.get(potentialCommand) ?? this.#commands.get(findCommandFromAlias(potentialCommand, this.#commands))
        if (!command || !command.execute) {
            this.#createOutput(`foxsh: ${potentialCommand}: command not found`)
            return
        }

        if (!inputArray[0]) {
            inputArray[0] = ""
        }

        inputArray = (encodeHTML(inputArray.join(" "))).split(" ")

        const output = await command.execute({
            classThis: this, args: inputArray
        })

        if (!output) {
            this.#createOutput("")
            return
        }
        this.#createOutput(output.replace(/\n/g, "<br>"))
    }
    #createOutput(outputHTML) {
        const container = document.createElement('div')
        container.className = "promptdiv"
        const outputSpan = document.createElement('span')
        outputSpan.className = "output"
        outputSpan.innerHTML = outputHTML
        replaceEmotesInElm(outputSpan)

        container.appendChild(outputSpan)
        this.#root.append(container)
    }
}