const emotes = ['GingBlep.png', 'GingCri.png', 'GingHappy.png', 'GingkaCreep.png', 'owo.gif', 'eos.png']
const emoteRegex = /:([\w_-])+:/gi // matches text between two colons (but not numbers)
const emoteDims = 15

// functions
function addBlankToLinks() {
    const links = document.getElementsByTagName('a')
    // MAYBE: ipns as well?
    const thisDomain = 'https://experibassmusic.eth.limo'
    for (const a of links) {
        if (a.href.startsWith('https://') && !a.href.startsWith(thisDomain)) {
            a.target = '_blank' // open external links in a new tab
        }
    }
}

function getAllTextElms() {
    // not really *all* text elms, but the ones used on this site lol
    const textElems = [
        ...document.getElementsByTagName('p'),
        ...document.getElementsByTagName('span'),
        ...document.getElementsByTagName('a'),
        ...document.getElementsByTagName('h1'),
        ...document.getElementsByTagName('h2'),
        ...document.getElementsByTagName('h3'),
        ...document.getElementsByTagName('pre'),
    ]
    return textElems
}

async function copy(elm, config) {
    if (!elm) {
        return alert("The element to copy doesn't exist.")
    }
    if (navigator.clipboard) {
        let text = elm.innerText
        if (config?.trimNewlines) {
            text = text.replace(/\n/g, ' ')
        }
        if (config?.removeSpaces) {
            text = text.replace(/ /g, '')
        }
        await navigator.clipboard.writeText(text)
        return
    } else {
        return alert("Your browser doesn't support the Clipboard API!")
    }
}

function replaceEmotes() {
    // start processing emotes
    for (const elm of getAllTextElms()) {
        replaceEmotesInElm(elm)
    }
}

function replaceEmotesInElm(elm) {
    const matches = elm.innerText.match(emoteRegex)

    if (!matches) {
        return
    }
    // abusing img tags, fun!
    const emoteTemplate = `<img width="${emoteDims}px" height="${emoteDims}px" class="emote" alt=":TITLE:" title=":TITLE:" src="src/images/emotes/EMOTE" />`
    for (const match of matches) {
        const emoteName = match.slice(1, -1) // trim ':'
        const emote = emotes.filter((v) => v.startsWith(`${emoteName}.`))[0] // be sure its actually an emote
        const img = emoteTemplate.replace('EMOTE', emote).replace(/TITLE/g, emoteName) // replace the placeholders with their contents
        elm.innerHTML = elm.innerHTML.replace(match, img)
    }
}

// MAYBE: display different messages for ipfs and clearnet?
function checkDomain() {
    const url = window.location

    if (url.protocol === 'ipfs:') {
    }
}

/// amazing name, eh?
function errorCleaner(err) {
    err.stack = err.stack.replace(new RegExp(`${window.location.origin}/`, 'gi'), '')
    return `${err}\n${err.stack}`
}

/// there has to be a better way...
/// MAYBE: make .handlebars and compile?
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
                title="Region Tundem on Planet A ("Nosdun"), orbiting Star 6 in Galaxy 4604B"
                class="hov">
                Tundem, 4604B-6A (Nosdun)
            </span>
        </span>
        <span><strong>Looking For:</strong> Webrings to join and others of my species :GingBlep:</span>
        <span><strong>Do I know you?:</strong> No.</span>
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
        My Audius is linked in Links, along with my other socials!
    </p>
    `,
    links: `
    <h2>> links</h2>
    <a href="https://audius.co/experibass"> audius</a>
    <a href="https://bsky.app/profile/experibassmusic.bsky.social">  bluesky</a>
    <a href="https://github.com/experibass"> github (i mirror out my repos to here)</a>
    <span> forgejo (eventually)</span>
    <a href="https://speedrun.com/user/ExperiBass"> speedrun.com</a>
    <a href="https://twitch.tv/experibassmusic"> twitch (I stream sometimes :3)</a>
    <a href="https://twitter.com/experibassmusic"> twitter (lets see how long this platform lasts)</a>
    <a href="https://youtube.com/channel/UCx6VxDU880NuvLbWH8xT2GA">  youtube (I upload visuals and speedruns here :owo:)</a>
    <a href="https://github.com/ExperiBass/dotfiles"> my dotfiles</a>
    <a href="https://linux-hardware.org/?probe=7b3cdda6e2"> hardware probe</a>
    <span> Playlists<span class="cursor-blink">_</span></span>
    <a href="https://music.apple.com/us/playlist/%CE%B3iddim/pl.u-NpXmza7t4yVpke7">riddim</a>
    <a href="https://music.apple.com/us/playlist/%CF%80utty/pl.u-oZyl3PaCGaB0dxD">nutty</a>
    <a href="https://music.apple.com/us/playlist/b%CE%B3iddim/pl.u-WabZv4ZieNAvxLY">briddim</a>
    <a href="https://music.apple.com/us/playlist/h%CE%B4%CE%B3dstyl%CE%BE/pl.u-NpXmzeWF4yVpke7">hardstyle</a>
    <a href="https://music.apple.com/us/playlist/jvmpstyl%CE%BE/pl.u-2aoqXKDiG20LlDe">jumpstyle</a>
    <span><i>still</i> too lazy to update this</span>
    <span> Tools/Utils<span class="cursor-blink">_</span></span>
    <a href="https://github.com/experibass/cli-pride-flags">pride flags in your term~</a>
    <a href="https://github.com/experibass/unified-pride-flags">unified list for pride flag colors and weights</a>
    <a href="https://github.com/experibass/pixelsort-go">pixelsorter written in golang</a>
    `,
    otherpages: `
    <h2>> otherpages</h2>
    <span>A list of the other pages on this site.</span>
    <a href="cyberspace-independence.html">declaration of the independence of cyberspace</a>
    <a href="eve.html">eve photo gallery</a>
    <a href="flags.html">unified-pride-flags flag previews</a>
    <a href="key.txt">pgp pubkey</a>
    <a href="pixelsorts.html">pixelsort gallery</a>
    <a href="term.html">this page, but in a terminal-like interface</a>
    `,
    contact: `
    <h2>> contact</h2>
    <span><strong>BlueSky:</strong> look in Links</span>
    <span><strong>Lemmy:</strong> soon</span>
    <span><strong>Masto:</strong> maybe (likely not)</span>
    <span><strong>󱡯 Email:</strong> <span class="hov" onclick="copy(this)">gingkagingerpepper [at] icloud [dot] com</span></span>
    `,
    comms: `
    <h2>> commissions</h2>
    <h3>Purchasing Tracks<span class="cursor-blink">_</span></h3>
    <p>
        Wanna buy one or more of my tracks/albums? Shoot me an email with
        the names and your payment method!
    </p>

    <s>
        <h3>Music Commissions<span class="cursor-blink">_</span></h3>
        <p>
            I take music commissions! I do Hardstyle, Trap, and Techno, and the price ranges
            from USD$?? to USD$?? depending on complexity.
        </p>
        <p>
            If you decide to commission me, I'll need a general mood of your track with reference songs. I do
            <b>NOT</b> do vocals, though I <i>can</i> use pre-existing vocals (that would bump the price by
            USD$??). Cover art is out of scope.
        </p>
        <p>
            During the creation of your track, I'll send WIPs for your input, and once it's done to your liking
            and I receive payment I'll send the .mp3 (320 kbps) and .wav.
        </p>
    </s>
    <span>On Hold</span>

    <h3>Code Commissions<span class="cursor-blink">_</span></h3>
    <p>
        I also write code on commission. I can do just about anything non-frontend in JavaScript and Go, excluding Discord bots
        (I have beef).
    </p>
    <p>
        My prices start at a base of USD$20 for a <=32KiB script, and will increase depending on the complexity of the project. Any
        updates past the original details will have a USD$50 charge.
    </p>
    <p>When I'm commissioned, I require the details to be fully laid out, preferably in a Trello board.</p>
    <h4>Terms and Conditions</h4>
    <p>
        I will not do nsfw comissions. You can do anything you want to the track once it's
        finished <i>except</i> resell without my explicit permission. I do reserve the right to use and edit the
        finished product for myself if I choose. (<a href="https://creativecommons.org/licenses/by-nc/4.0/">CC-BY-NC-4.0</a>)
    </p>
    <h3>Payment</h3>
    <p>See <a onclick="menuAction({target:{attributes:{page:{value:'payment'}}}})">Payment</a> :3</p>
    <h3>Contacting</h3>
    <p>See <a onclick="menuAction({target:{attributes:{page:{value:'contact'}}}})">Contacting</a> :3</p>
    `,
    payment: `
    <h2>> payment</h2>
    <p>Art is a valid currency :3 Shoot me a dm if you wanna trade!</p>
    <p>Payment in fiat will be conducted through CashApp.</p>
    <p>
        Cryptocurrency payments will be accepted after 3 (BTC)/6 (ETH/XMR) confirmations.
        You get a 3% discount as well :3
    </p>
    <p>
        Click on an address to insert it into your clipboard! Make sure the addresses are correct, especially on
        Windows, as there is malware that will replace addresses with the address of the attacker.
    </p>
    <p>BTC-LN: <span class="hov" onclick="copy(this)">experibassmusic@bitrefill.me</span></p>
    <p>BTC/ETH/XMR: <span class="hov" onclick="copy(this)">experibassmusic.eth</span></p>
    <p>No ENS resolution? Here's the addresses :3</p>
    <p>BTC: <span class="hov" onclick="copy(this, {trimNewlines: true, removeSpaces: true})">
        <span>bc1p</span> <span>4egh</span> <span>gf2j</span> <span>rtpu</span>
        <span>sqxa</span> <span>a9vf</span> <span>2uvy</span> <span>t47a</span>
        <span>tkuk</span> <span>qvs4</span> <span>t78a</span> <span>f06c</span>
        <span>50vl</span> <span>f8ds</span> <span>tg3f</span> <span>73</span>
    </span></p>
    <p>ETH: <span class="hov" onclick="copy(this)">
        <span>0x8B</span> <span>b53b</span> <span>C2a6</span> <span>3F2b</span>
        <span>d10B</span> <span>16bd</span> <span>0aD6</span> <span>fCDc</span>
        <span>1ffd</span> <span>49d1</span> <span>14</span>
    </span></p>
    <p>XMR: <span class="hov" onclick="copy(this)">
        <span>88uc</span> <span>Q7Bu</span> <span>EHmU</span> <span>f7SB</span>
        <span>ADsP</span> <span>F6PM</span> <span>wSVL</span> <span>wFAg</span>
        <span>gDW9</span> <span>uj7R</span> <span>SqqZ</span> <span>JS23</span>
        <span>QHxa</span> <span>e2Ai</span> <span>p5oM</span> <span>jQKK</span>
        <span>YaG1</span> <span>pirT</span> <span>ZJxu</span> <span>QW4s</span>
        <span>qgXS</span> <span>fJu6</span> <span>DbUX</span> <span>Qrc</span>
    </span></p>
    `,
}
