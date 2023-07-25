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
    #motd = `Confused? Run "<span class="blinking">help</span>"!<br>This terminal has tab completion!`
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
                const command = classThis.#commands.get(args[0]) ?? classThis.#commands.get(findCommandFromAlias(args[0], this.#commands))
                if (!command) {
                    return `foxsh: Yip! "${command}" not found.`
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
        "aboutme": {
            async execute() {
                const output =
                    `<div id="aboutme">
                    <h3> About Me</h3>
                    <pre>
                    <strong>Preferred Names:</strong> /Ging(ka|er){0,1}/ Pepper
                    <strong>Age:</strong> N/A
                    <strong>Gender:</strong> Fluid
                    <strong>Sex:</strong> Male :GingCri:
                    <strong>Pronouns:</strong> He/Him She/Her (Ask)
                    <strong>Orientation:</strong> Bi
                    <strong>Location:</strong> Universe 2, Quadrant C, Sector B
                    <strong>GPG Pawprint:</strong>
                    <b id="pawprint" class="hov" onclick="copy(this)" title="Click to copy!">${pawprint}</b>
                </pre>
                </div>
                `
                return output
            }
        },
        "bio": {
            execute() {
                const output =
                    `<div id="bio">
                    <h3>龎 Bio</h3>
                    <p>:GingBlep: Hai! I'm a stimky internet fox! I write code, do crime, and steal your garlic bread :GingkaCreep:
                        I main JS, although I'm happy in most langs uwu
                        I like making stupid scripts and bending JS to my will, you can see some samples in the source for this page (one being this emote system :GingHappy:)
                        I speedrun WipEout Pure, slowly getting into running 2048 too uwu</p>
                    <p>I also make music! I seem to have stuck with Trap and early 2000s Hardstyle, but I like to dabble in everything :owo:
                        My Audius is linked below, along with my other socials!</p>
                </div>
                `
                return output
            }
        },
        "links": {
            execute() {
                const output =
                    `<div id="links">
                    <h3>󰌹 Links</h3>
                    <a href="https://audius.co/experibass">󰠃 Audius</a>
                    <a href="https://youtube.com/channel/UCx6VxDU880NuvLbWH8xT2GA">󰗃 YouTube (I upload visuals and speedruns here :owo:)</a>
                    <a href="https://twitch.tv/experibassmusic">󰕃 Twitch (I stream sometimes :3)</a>
                    <a href="https://speedrun.com/user/ExperiBass">󰑮 SpeedRun.com</a>
                    <a href="https://github.com/experibass">󰊤 GitHub</a>
                    <a href="https://linux-hardware.org/?probe=7b3cdda6e2">󰋊 Hardware Probe</a>
                    <a href="https://github.com/ExperiBass/linux-dotfiles"> My Dotfiles</a>
                    <h3>󰲸 Playlists</h3>
                    <a href="https://music.apple.com/us/playlist/b%CE%B3iddim/pl.u-WabZv4ZieNAvxLY">Briddim</a>
                    <a href="https://music.apple.com/us/playlist/colo%CE%B3-b%CE%BBss/pl.u-WabZvAVueNAvxLY">Color Bass</a>
                    <a href="https://music.apple.com/us/playlist/h%CE%BB%CE%B3dstyl%CE%BE/pl.u-NpXmzeWF4yVpke7">Hardstyle</a>
                    <a href="https://music.apple.com/us/playlist/%CE%B3iddim/pl.u-NpXmza7t4yVpke7">Riddim</a>
                    <h2>more to come...</h2>
                </div>
                `
                return output
            }
        },
        "contact": {
            execute() {
                const output =
                    `<div id="contact">
                        <h3>󰛋 Contact</h3>
                        <p><strong>󰘨 Matrix:</strong> @experibassmusic:kde.org</p>
                        <p><strong>󰇮 Email:</strong> <span class="hov" onclick="copy(this)">gingkagingerpepper [at] icloud [dot] com</span></p>
                </div>
                `
                return output.split('\n').join('')
            }
        },
        "wallets": {
            execute() {
                const output =
                    `<div id="wallets">
                    <h3>󰖄 Wallet Addresses</h3>
                    <p>If you enjoy what I do, feel free to send a bit of crypto :3</p>
                    <p>Click on an address to insert it into your clipboard!
                        Make sure the addresses are correct, especially on Windows,
                        as there is malware that will replace addresses with the address of the attacker.</p>
                    <p>All coins: <span class="hov" onclick="copy(this)">*experibassmusic.eth*</span></p>
                    <p>For wallets that do not support ENS resolution, see below.</p>
                    <p>BTC (preferred): <span class="hov"
                            onclick="copy(this)">bc1qlxpe2uw7pkdctxghdgvsu47rknvcmz2j27hxvx</span></p>
                    <p>BTC Lightning (preferred): <span class="hov" onclick="copy(this)">experibassmusic@bitrefill.me</span><br>or ask for invoice</p>
                    <p>ETH: <span class="hov" onclick="copy(this)">0x8Bb53bC2a63F2bd10B16bd0aD6fCDc1ffd49d114</span></p>
                    <p>XMR: ask</p>
                </div>
                `
                return output.split('\n').join('')
            }
        }
    }
    #commands = new Map(Object.entries(this.#commandsDef))
    constructor(rootElm, motd) {
        this.#root = rootElm
        motd ? this.#motd = motd : ""
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