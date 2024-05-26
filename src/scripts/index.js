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
            elm.previousElementSibling?.focus()
            return
        }
        if (ev.key === 'ArrowDown') {
            ev.preventDefault()
            elm.nextElementSibling?.focus()
            return
        }

        // TODO: arrow left/right to move from menu to infopanel and back

        // unfocus
        if (ev.key === 'Escape') {
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
/// there has to be a better way...
/// part of me wants to compile all this with some sort of static site genrator
/// preferably my own
const sections = {
    aboutme: `
        <h2>> aboutme</h2>
        <span><strong>Preferred Names:</strong> /Gïng(ka|er){0,1}/ Pepper</span>
        <span><strong>Age:</strong> N/A</span>
        <span><strong>Species:</strong> ?????? (Lostkin)</span>
        <span><strong>Gender:</strong> Fluid</span>
        <span><strong>Pronouns:</strong> Ask</span>
        <span><strong>Sex:</strong> Not within the Human trinary</span>
        <span><strong>Orientation:</strong> Bi</span>
        <span>
            <strong>Location:</strong>
            <span
                title="Universe 2, Layer 7, Sector T-584, Galaxy Kii, Ring 6, Planet Nosdun, Region Tundem"
                class="hov">
                U2|L7|ST-584|GKii|R6|PNosdun|RTundem
            </span>
        </span>
        <span><strong>Looking For:</strong> Webrings to join and others of my species :GingBlep:</span>
        <span><strong>Do I know you?</strong> No.</span>
        <strong>PGP Pawprint:</strong>
        <b id="pawprint" class="hov copyable" onclick="copy(this, {trimNewlines: true})" title="Click to copy!">
            <span>33A8</span> <span>1E0A</span> <span>9FD6</span> <span>6E1B</span> <span>5D02</span><br />
            <span>7649</span> <span>5F47</span> <span>E26A</span> <span>5D22</span> <span>1AEC</span>
        </b>
        <h2>> currentsetup</h2>
        <pre>
        <strong>2020 MacBook Pro (13"):</strong>
        16GB RAM
        Intel Core i5
        <a href="https://endeavouros.com/">EndeavourOS :eos: (btw)</a>

        <strong>MIDI Devices:</strong>
        Akai Pro MPK Mini MKII
        Korg NanoKontrol2

        <strong>Misc:</strong>
        4TB Western Digital easyStore HDD
        Logitech g502 HERO (wired)
        j5create 7-port USB Hub
        </pre>
    `,
    bio: `
    <h2>> bio</h2>
    <p>
        :GingBlep: Hai! I'm a stimky internet fox! I write code, do crime, and steal your garlic bread
        :GingkaCreep:<br />
        I main JS, although I'm happy in most langs except C/C++ uwu<br />
        I like making stupid scripts and bending JS to my will, you can see some samples in the source for this
        page (one being this emote system :GingHappy:)<br />
        I speedrun WipEout Pure, I want to do 2048 runs too uwu
    </p>
    <p>
        I also make music! I seem to have stuck with Trap and early 2000s Hardstyle, but I like to dabble in
        everything :owo:<br />
        My Audius is linked below, along with my other socials!
    </p>
    `,
    links: `
    <h2>> links</h2>
    <a href="https://audius.co/experibass">󰠃 audius</a>
    <a href="https://youtube.com/channel/UCx6VxDU880NuvLbWH8xT2GA">
        󰗃 youtube (I upload visuals and speedruns here :owo:)
    </a>
    <a href="https://twitter.com/experibassmusic">󰕄 twitter (lets see how long this platform lasts)</a>
    <a href="https://twitch.tv/experibassmusic">󰕃 twitch (I stream sometimes :3)</a>
    <a href="https://speedrun.com/user/ExperiBass">󰑮 speedrun.com</a>
    <a href="https://github.com/experibass">󰊤 github</a>
    <a href="https://linux-hardware.org/?probe=7b3cdda6e2">󰋊 hardware probe</a>
    <a href="https://github.com/ExperiBass/linux-dotfiles"> my dotfiles</a>
    <h3>󰲸 Playlists<span class="cursor-blink">_</span></h3>
    <a href="https://music.apple.com/us/playlist/%CF%80utty/pl.u-oZyl3PaCGaB0dxD">nutty</a>
    <a href="https://music.apple.com/us/playlist/b%CE%B3iddim/pl.u-WabZv4ZieNAvxLY">briddim</a>
    <a href="https://music.apple.com/us/playlist/h%CE%B4%CE%B3dstyl%CE%BE/pl.u-NpXmzeWF4yVpke7">hardstyle</a>
    <a href="https://music.apple.com/us/playlist/jvmpstyl%CE%BE/pl.u-2aoqXKDiG20LlDe">jumpstyle</a>
    <a href="https://music.apple.com/us/playlist/%CE%B3iddim/pl.u-NpXmza7t4yVpke7">riddim</a>
    <span>still too lazy to update this</span>
    <h3>󱌣 Tools/Utils<span class="cursor-blink">_</span></h3>
    <a href="https://github.com/experibass/unified-pride-flags">unified list for pride flag colors and weights</a>
    <a href="https://github.com/experibass/cli-pride-flags">pride flags in your term~</a>
    <a href="https://github.com/experibass/pixelsort-go">pixelsorter written in go</a>
    `,
    otherpages: `
    <h2>> otherpages</h2>
    <span>A list of the other pages on this site.</span>
    <a href="key.txt">pgp pubkey</a>
    <a href="term.html">this page, but in a terminal-like interface</a>
    <a href="flags.html">unified-pride-flags flag previews</a>
    <a href="pixelsorts.html">pixelsorted images i've done</a>
    <a href="gallery.html">eve photo gallery</a>
    <a href="cyberspace-independence.html">declaration of the independence of cyberspace</a>
    `,
    contact: `
    <h2>> contact</h2>
    <span><strong>Lemmy:</strong> soon</span>
    <span><strong>Masto:</strong> maybe (likely not)</span>
    <span><strong>󰘨 Matrix:</strong> <span class="hov" onclick="copy(this)">@experibassmusic:kde.org</span></span>
    <span>
        <strong>󰇮 Email:</strong>
        <span class="hov" onclick="copy(this)">gingkagingerpepper [at] icloud [dot] com</span>
    </span>
    `,
    comms: `
    <h2>> commissions</h2>
    <s>
        <h3>Music Commissions<span class="cursor-blink">_</span></h3>
        <p>
            I do take music commissions. I do Hardstyle, Trap, and Techno, and the price ranges from USD$40 to
            USD$80 (or the equivalent in an accepted crypto) depending on complexity.
        </p>
        <p>
            If you decide to commission me, I'll need a general mood of your track with reference songs. I do
            <b>NOT</b> do vocals, though I <i>can</i> use pre-existing vocals (that would bump the price by
            USD$25). If you want custom cover art that'll bump the price by whatever the chosen artist to create
            the covers prices are.
        </p>
        <p>
            During the creation of your track, I'll send WIPs for your input, and once it's done to your liking
            and I receive payment I'll send the .mp3 (320 kbps) and .wav.
        </p>
    </s>
    <span>On Hold</span>
    <h3>Code Commissions<span class="cursor-blink">_</span></h3>
    <p>
        I also write code on commission. I can do just about anything in JavaScript, excluding Discord bots (I
        have beef).
    </p>
    <p>
        My prices start at a base of USD$150, and will increase depending on the complexity of the project. Any
        updates past the original details will have a USD$50 charge.
    </p>
    <p>When I'm commissioned, I require the details to be fully laid out, preferably in a Trello board.</p>
    <h4>Terms and Conditions</h4>
    <p>
        I will not use lewd sounds in my comissions. You can do anything you want to the track once it's
        finished <i>except</i> resell without my explicit permission. I do reserve the right to use and edit the
        finished product for myself if I choose. (<a href="https://creativecommons.org/licenses/by-nc/4.0/">CC-BY-NC-4.0</a>)
    </p>
    <h3>Payment</h3>
    <p>Payment in fiat will be conducted through CashApp or Zelle, whichever is easier. USD only.</p>
    <p>
        With crypto payment, the accepted coins are listed in the
        <a href="#wallets">Wallets</a> section.
    </p>
    <p>
        If you're paying in crypto, it will only be accepted after 3 to 6 confirmations, depending on the chain
        used.
    </p>
    <h4>Contacting</h4>
    <p>You can contact me via Matrix, Twitter, or email.</p>
    `,
    wallets: `
    <h2>> wallets</h2>
    <p>If you enjoy what I do, feel free to send a bit of crypto :3</p>
    <p>
        Click on an address to insert it into your clipboard! Make sure the addresses are correct, especially on
        Windows, as there is malware that will replace addresses with the address of the attacker.
    </p>
    <p>All coins:<br /><span class="hov" onclick="copy(this)"><i>experibassmusic.eth</i></span></p>
    <p>For wallets that do not support ENS resolution, see below.</p>
    <p>
        BTC Lightning (preferred):<br />
        <span class="hov" onclick="copy(this)">
            experibassmusic@bitrefill.me
        </span><br />or ask for invoice
    </p>
    <p>
        BTC (preferred):<br /><span class="hov" onclick="copy(this)"
            >bc1qlxpe2uw7pkdctxghdgvsu47rknvcmz2j27hxvx</span
        >
    </p>
    <p>ETH:<br /><span class="hov" onclick="copy(this)">0x8Bb53bC2a63F2bd10B16bd0aD6fCDc1ffd49d114</span></p>
    <p>XMR:<br />ask</p>
    `,
}

/// ok now do the thing
try {
    addBlankToLinks()
    activateMenu()
} catch (e) {
    const pane = document.getElementById('pane')
    pane.innerText = errorCleaner(e)
}
