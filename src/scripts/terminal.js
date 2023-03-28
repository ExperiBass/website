function findCommandFromAlias(alias, commands) {
    for (const [name, value] of commands.entries()) {
        if (value.aliases && value.aliases.includes(alias)) {
            return name
        }
    }
    return undefined
}
function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}
const pawprint = "3F9E 3F84 28AC 4B96 F893 0E8E 971B 7C5E 1DCE"
const alert = (msg) => { return msg } // override global alert(), terminals dont have such posh features
class Terminal {
    #root = null
    #motd = `Confused? Run "<span class="blinking">help</span>"!`
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
                    return "Command not found."
                }
                return `${command.description || ''}\nAliases: ${command.aliases || 'none'}`
            },
            aliases: ['commands', '?']
        },
        "fakefetch": {
            description: 'Fake neofetch.',
            async execute() {
                let output =
                    `⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   guest@ebm
                ⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   -----------
                ⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   OS: FoxOS
                ⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠆⠜⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   Host: ${window.location.hostname}
                ⣿⣿⣿⣿⠿⠿⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿   Kernel: 6.2.1-fox
                ⣿⣿⡏⠁⠀⠀⠀⠀⠀⣀⣠⣤⣤⣶⣶⣶⣶⣶⣦⣤⡄⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿   Uptime: ∞
                ⣿⣿⣷⣄⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⡧⠇⢀⣤⣶⣿⣿⣿⣿⣿⣿⣿   Packages: 926 (den)
                ⣿⣿⣿⣿⣿⣿⣾⣮⣭⣿⡻⣽⣒⠀⣤⣜⣭⠐⢐⣒⠢⢰⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿   Shell: foxsh 10
                ⣿⣿⣿⣿⣿⣿⣿⣏⣿⣿⣿⣿⣿⣿⡟⣾⣿⠂⢈⢿⣷⣞⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿   Resolution: ${window.innerWidth}x${window.innerHeight}
                ⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣷⣶⣾⡿⠿⣿⠗⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   WM: foxwm
                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠻⠋⠉⠑⠀⠀⢘⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   Terminal: foxterm
                ⣿⣿⣿⣿⣿⣿⣿⡿⠟⢹⣿⣿⡇⢀⣶⣶⠴⠶⠀⠀⢽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   CPU: Vulpera 9472S (32) @ 3.800THz
                ⣿⣿⣿⣿⣿⣿⡿⠀⠀⢸⣿⣿⠀⠀⠣⠀⠀⠀⠀⠀⡟⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   GPU: Zerda FOX G5
                ⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⠹⣿⣧⣀⠀⠀⠀⠀⡀⣴⠁⢘⡙⢿⣿⣿⣿⣿⣿⣿⣿⣿   Memory: 6169MiB / 320000MiB
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
                return await copy(inviSpan)
            }
        },
        "aboutme": {
            async execute() {
                let output =
                    `<div id="aboutme">
                <h2>> aboutme</h2>
                <h3> About Me</h3>
                <strong>Preferred Names:</strong> /Ging(ka|er){0,1}/ Pepper
                <strong>Age:</strong> N/A
                <strong>Gender:</strong> Fluid
                <strong>Sex:</strong> Male :GingCri:
                <strong>Pronouns:</strong> He/Him She/Her (Ask)
                <strong>Orientation:</strong> Bi
                <strong>Location:</strong> Universe 2, Quadrant C, Sector B
                <strong>GPG Pawprint:</strong>
                <b id="pawprint">${pawprint}</b>
                <i>run "copypawprint" to copy it to your clipboard</i>
            </div>
                `
                return output
            }
        },
        "bio": {
            execute() {
                const output =
                    `<div id="bio">
                        <h2>> bio</h2>
                        <h3>龎 Bio</h3>
                        <span>:GingBlep: Hai! I'm a stimky internet fox! I write code, do crime, and steal your garlic bread
                            :GingkaCreep:<br>
                            I main JS, although I'm happy in most langs uwu<br>
                            I like making stupid scripts and bending JS to my will, you can see some samples in the source for this
                            page (one being this emote system :GingHappy:)<br>
                            I speedrun WipEout Pure, slowly getting into running 2048 too uwu</span>
                        <span>I also make music! I seem to have stuck with Trap and early 2000s Hardstyle, but I like to dabble in
                            everything :owo:<br>
                            My Audius is linked below, along with my other socials!</span>
                    </div>
                `
                return output
            }
        },
        "links": {
            execute() {
                const output =
                    `<div id="links">
                    <h2>> links</h2>
                    <h3> Links</h3>
                    <a href="https://audius.co/experibass"> Audius</a><br>
                    <a href="https://pettingzoo.co/@experibassmusic" rel="me">ﳄ Mastodon</a><br>
                    <a href="https://youtube.com/channel/UCx6VxDU880NuvLbWH8xT2GA"> YouTube (I upload visuals and speedruns here :owo:)</a><br>
                    <a href="https://instagram.com/experibassmusic"> Instagram (teasers sometimes)</a><br>
                    <a href="https://twitter.com/experibassmusic">暑 Twitter</a><br>
                    <a href="https://twitch.tv/experibassmusic">既 Twitch (I stream sometimes :3)</a><br>
                    <a href="https://speedrun.com/user/ExperiBass">省 SpeedRun.com</a><br>
                    <a href="https://github.com/experibass"> GitHub</a><br>
                    <a href="https://linux-hardware.org/?probe=7b3cdda6e2"> Hardware Probe</a><br>
                    <a href="https://github.com/ExperiBass/linux-dotfiles"> My Dotfiles</a>
                    <h3> Playlists</h3>
                    <a href="https://music.apple.com/us/playlist/b%CE%B3iddim/pl.u-WabZv4ZieNAvxLY">Briddim</a><br>
                    <a href="https://music.apple.com/us/playlist/colo%CE%B3-b%CE%BBss/pl.u-WabZvAVueNAvxLY">Color Bass</a><br>
                    <a href="https://music.apple.com/us/playlist/h%CE%BB%CE%B3dstyl%CE%BE/pl.u-NpXmzeWF4yVpke7">Hardstyle</a><br>
                    <a href="https://music.apple.com/us/playlist/%CE%B3iddim/pl.u-NpXmza7t4yVpke7">Riddim</a><br>
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
                    <h2>> contact</h2>
                    <h3> Contact</h3>
                    <pre>
                    <strong>ﬧ Matrix:</strong> @experibassmusic:kde.org
                    <strong> Email:</strong> <span class="hov" onclick="copy(this)">gingkagingerpepper [at] icloud [dot] com</span>
                </pre>
                </div>
                `
                return output
            }
        },
        "wallets": {
            execute() {
                const output =
                    `<div id="wallets">
                    <h2>> wallets</h2>
                    <h3>廙 Wallet Addresses</h3>
                    <span>If you enjoy what I do, feel free to send a bit of crypto :3</span>
                    <span>Click on an address to insert it into your clipboard!
                        Make sure the addresses are correct, especially on Windows,
                        as there is malware that will replace addresses with the address of the attacker.</span>
                    <span>All coins:<br><span>experibassmusic.eth</span></span>
                    <span>For wallets that do not support ENS resolution, see below.</span>
                    <span>BTC (preferred):<br><span>bc1qlxpe2uw7pkdctxghdgvsu47rknvcmz2j27hxvx</span></span>
                    <span>BTC Lightning (preferred):<br>ask for invoice, max USD$1,000</span>
                    <span>ETH:<br><span>0x8Bb53bC2a63F2bd10B16bd0aD6fCDc1ffd49d114</span></span>
                    <span>XMR:<br>ask</span>
                </div>
                `
                return output
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
    #lockPrompt(prompt, inputCompletion) {
        prompt.id = "" // unset id so next prompt can be used
        inputCompletion.id = ""
        prompt.contentEditable = false
        prompt.outerHTML = prompt.outerHTML
        prompt._suggest.stop() // gotta stop this last or the prompt will still be enabled
    }
    async #keyDown(ev) {
        const currPrompt = ev.currentTarget
        const currPromptCompletion = currPrompt.nextElementSibling

        if (ev.key === "Enter") {
            ev.preventDefault()
            this.#lockPrompt(currPrompt, currPromptCompletion)
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

        container.appendChild(outputSpan)
        this.#root.append(container)
    }
}