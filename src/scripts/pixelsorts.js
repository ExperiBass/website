const tld = 'https://foxuments.experibassmusic.eth.limo/pixelsort-gens'
/// TODO: image groups with shared source?
const images = [
    { url: '/misc/TheriaNoise.png', desc: '' },
    { url: '/misc/lakepadden-sorted.png', desc: 'some pic of Lake Padden in Washington, USA' },
    {
        url: '/misc/vaporwavegarden-sorted.jpg',
        desc: 'i started layering sorts with this pic, i love how the two directions overlap :3',
    },
    { url: '/misc/waterpark-sorted.jpg', desc: 'low-quality pic of a waterpark' },
    {
        url: '/lakesurroundedwithmountain/pexels-eberhardgross-629161-sorted-mashup.jpg',
        desc:
            'one of my favorites so far, overlapping sort thresholds is nice x3' +
            '<br>this one was done with:' +
            '<br>lightness with a threshold of [0.0,0.3],'+
            '<br>wave with a length of 240, by hue, at [0.2,0.6] and 45 degrees,'+
            '<br>reverse wave with a length of 360, by red, at [0.5,0.9] and -45 degrees,'+
            '<br>and a randomsort by saturation at [0.8,1.0].'+
            '<br>sidenote, this guy takes the *best* pics :O',
        sourceURL: 'https://www.pexels.com/photo/lake-surrounded-with-mountain-629161',
    },
    {
        url: '/bridgeskyline/right-then-down.jpg',
        desc: 'classic pixelsort with the city masked off',
        sourceURL: 'https://www.pexels.com/photo/concrete-bridge-near-buildings-during-golden-hour-1755683',
    },
    {
        url: '/bridgeskyline/differential-classic.jpg',
        desc: 'classic pixelsort, but with a mask made by a differential edge detect in GIMP',
        sourceURL: 'https://www.pexels.com/photo/concrete-bridge-near-buildings-during-golden-hour-1755683',
    },
    { url: '/dark-brandon/sorted.jpeg', desc: 'dark brandooooooooooon' },
    {
        url: '/dark-brandon/90-deg-spiral-masked.jpeg',
        desc: '/uj spiral sorting is cool, even cooler when you rotate the image furst<br>/rj dark brandon that was a spice vape!',
    },
    {
        url: '/lumn-forest/heavy-sort.jpg',
        desc: 'my wallpaper for a little bit, i ended up using this pic a lot to test pixelsort_go :3',
        sourceURL: 'https://www.pexels.com/photo/green-leafed-trees-during-fog-time-167684',
    },
    {
        url: '/lumn-forest/superpixel.jpg',
        desc: 'another version, this time using GIMPs superpixel filter to generate the mask',
        sourceURL: 'https://www.pexels.com/photo/green-leafed-trees-during-fog-time-167684',
    },
    {
        url: '/lumn-forest/matrixisfailing.jpg',
        desc: 'and a third, i dont remember what i did here but it involved thresholds',
        sourceURL: 'https://www.pexels.com/photo/green-leafed-trees-during-fog-time-167684',
    },
    {
        url: '/potm2310a/webb-reflective.jpg',
        desc: 'sometimes spiral sorting results in this interesting reflective pattern...',
        credits: 'ESA/Webb, NASA & CSA, A. Adamo (Stockholm University) and the FEAST JWST team',
        sourceURL: 'https://esawebb.org/images/potm2310a/'
    },
]

const gallery = document.getElementById('gallery')
try {
    let galleryHTML = ''
    for (const img of images) {
        const src = `${tld}${img.url}`
        let source = img.sourceURL ?? 'source unknown'
        if (img.sourceURL) {
            if (img.sourceURL.startsWith('https')) {
                source = `<a href="${img.sourceURL}">${img.credits || 'source'}</a>`
            }
        }
        galleryHTML += `<div class="img-container">
        <a href="${src}">
        <img src="${src}" loading="lazy"/>
        </a>
        <p class="img-desc">${img.desc} [${source}]</p>
        </div>`
    }
    gallery.innerHTML = galleryHTML
    addBlankToLinks()
} catch (e) {
    gallery.innerText = errorCleaner(e)
}