/**
    conways game of life in a favicon
    shoot me a email if you make tweaks, i want ideas :3
**/

function cgol(field = null, dims, wrap = false) {
    if (!field) {
        throw 'no field'
    }

    const fieldWidth = field.length
    const fieldHeight = field[0].length

    let newField = generateEmptyField(dims)
    for (let i = 0; i < fieldHeight; i++) {
        for (let ii = 0; ii < fieldWidth; ii++) {
            /// cell check!
            let liveNeighbors = 0
            /// furst, check neighbors
            if (wrap) {
                /// top and bottom
                liveNeighbors += field[ii]?.[i - 1] === undefined ? field[ii][fieldHeight - 1] : field[ii][i - 1]
                liveNeighbors += field[ii]?.[i + 1] === undefined ? field[ii][0] : field[ii][i + 1]
                /// left and right
                liveNeighbors += field[ii - 1]?.[i] === undefined ? field[fieldWidth - 1][i] : field[ii - 1][i]
                liveNeighbors += field[ii + 1]?.[i] === undefined ? field[0][i] : field[ii + 1][i]
                /// and now diagonals
                let negIdx = ii - 1
                if (negIdx === -1) {
                    negIdx = fieldWidth - 1
                }
                let posIdx = ii + 1
                if (posIdx === fieldWidth) {
                    posIdx = 0
                }
                liveNeighbors +=
                    field[negIdx]?.[i - 1] === undefined ? field[negIdx][fieldHeight - 1] : field[negIdx][i - 1]
                liveNeighbors += field[negIdx]?.[i + 1] === undefined ? field[negIdx][0] : field[negIdx][i + 1]
                liveNeighbors +=
                    field[posIdx]?.[i - 1] === undefined ? field[posIdx][fieldHeight - 1] : field[posIdx][i - 1]
                liveNeighbors += field[posIdx]?.[i + 1] === undefined ? field[posIdx][0] : field[posIdx][i + 1]
            } else {
                /// top and bottom
                liveNeighbors += field[ii]?.[i - 1] === undefined ? 0 : field[ii][i - 1]
                liveNeighbors += field[ii]?.[i + 1] === undefined ? 0 : field[ii][i + 1]
                /// left and right
                liveNeighbors += field[ii - 1]?.[i] === undefined ? 0 : field[ii - 1][i]
                liveNeighbors += field[ii + 1]?.[i] === undefined ? 0 : field[ii + 1][i]
                /// and now diagonals
                liveNeighbors += field[ii - 1]?.[i - 1] === undefined ? 0 : field[ii - 1][i - 1]
                liveNeighbors += field[ii - 1]?.[i + 1] === undefined ? 0 : field[ii - 1][i + 1]
                liveNeighbors += field[ii + 1]?.[i - 1] === undefined ? 0 : field[ii + 1][i - 1]
                liveNeighbors += field[ii + 1]?.[i + 1] === undefined ? 0 : field[ii + 1][i + 1]
            }

            /// guess i'll Optional<die>
            const isAlive = !!field[ii][i]
            if (isAlive) {
                if (liveNeighbors < 2) {
                    newField[ii][i] = 0
                }
                /// "Any live cell with two or three live neighbours lives on to the next generation."
                else if (liveNeighbors > 3) {
                    newField[ii][i] = 0
                } else {
                    newField[ii][i] = field[ii][i]
                }
            } else {
                /// we ded bish
                if (liveNeighbors === 3) {
                    /// LAZARUS??????? :MaryPog:
                    newField[ii][i] = 1
                }
            }
        }
    }

    return newField
}
function printField(field) {
    const fieldWidth = field.length
    const fieldHeight = field[0].length
    let str = ''
    let coords = []
    for (let i = 0; i < fieldWidth; i++) {
        coords.push(`${i.toString().padStart(2, '0')}`)
    }
    str += `    ${coords.join(' ')}\n`
    for (let i = 0; i < fieldHeight; i++) {
        let line = []
        for (let ii = 0; ii < fieldWidth; ii++) {
            line.push(field[ii][i])
        }
        str += `${i.toString().padStart(2, ' ')} [ ${line.join('  ')} ]\n`
    }
    console.log(str.trimEnd())
}
function drawField(field, ctx) {
    const fieldWidth = field.length
    const fieldHeight = field[0].length

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, dims * pixelSize, dims * pixelSize)
    for (let i = 0; i < fieldHeight; i++) {
        for (let ii = 0; ii < fieldWidth; ii++) {
            const isAlive = !!field[ii][i]
            if (isAlive) {
                ctx.fillStyle = 'white'
            } else {
                ctx.fillStyle = 'black'
            }
            ctx.fillRect(ii * pixelSize, i * pixelSize, pixelSize, pixelSize)
        }
    }
    return ctx
}
function generateEmptyField(dims) {
    let field = Array(dims)
    for (let i = 0; i < field.length; i++) {
        field[i] = Array(dims).fill(0)
    }
    return field
}
function bigintToBin(bigint) {
    return (bigint >> 0n).toString(2)
}
async function digestMessage(message) {
    if (!window.crypto) {
        /// bruh, are you a dinosaur?
        console.error("window.crypto doesn't exist, use a modern browser ya dingus!")
        return undefined /// make sure everything breaks too
    }
    const encoder = new TextEncoder()
    const data = encoder.encode(message)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
}
async function seedField(seed, field) {
    const fieldWidth = field.length
    const fieldHeight = field[0].length
    const cellCount = fieldWidth * fieldHeight

    seed = await digestMessage(seed)

    /// expand
    while (seed.length <= Math.ceil(cellCount / 4)) {
        //console.log(seed.length, seed)
        seed += await digestMessage(seed)
    }

    /// turn into binary string
    //console.log(seed.length, cellCount)
    seed = bigintToBin(BigInt('0x' + seed))
    if (seed.length > cellCount) {
        /// grab the last bytes
        seed = seed.slice(-cellCount)
    }

    for (let i = 0; i < fieldHeight; i++) {
        for (let ii = 0; ii < fieldWidth; ii++) {
            let idx = i * fieldWidth + ii
            let bit = seed[idx]
            field[ii][i] = parseInt(bit)
        }
    }
    return field
}
function compareStates(A, B) {
    const fieldWidth = A.length
    const fieldHeight = A[0].length
    let res = true
    let diff = 0
    compareLoop: for (let i = 0; i < fieldHeight; i++) {
        for (let ii = 0; ii < fieldWidth; ii++) {
            if (A[ii][i] !== B[ii][i]) {
                res = false
                diff++
                //break compareLoop
            }
        }
    }
    return diff
}

const params = new URLSearchParams(window.location.search)
const dims = 64
const pixelSize = 1
const tickMS = parseInt(params.get('cgoltickms')) || 300

const icon = document.querySelector('link[rel="icon"]')
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = dims * pixelSize
canvas.height = dims * pixelSize

/// not tracking you i swear, this is for seeding the game
/// if you havent seen already, look in the favicon
let seedstring = '0'
if (navigator) {
    seedstring = navigator.userAgent
    seedstring += navigator.language
    seedstring += navigator.buildID
    seedstring += navigator.oscpu
    seedstring += navigator.hardwareConcurrency
    seedstring += navigator.maxTouchPoints
    seedstring += window.devicePixelRatio
    /// see, do we want these? firefox uses privacy mitigations, so its not useful for seeding the game
    // seedstring += Intl.DateTimeFormat().resolvedOptions().timeZone
    // seedstring += ((new Date()).getTimezoneOffset() / 60)
}
seedstring = seedstring.replace(/\s/g, '')
seedField(seedstring, generateEmptyField(dims)).then((field) => {
    printField(field)
    // document.body.appendChild(canvas)

    let state = field
    let iters = 0
    /// lower thresh = less alive at the end
    const stopThreshold = Math.ceil(dims * dims * 0.06)

    window.addEventListener(
        'load',
        () => {
            const inter = setInterval(() => {
                let oldstate = state
                state = cgol(state, dims, dims, true)
                /// keep going until we stabilize
                drawField(state, ctx)
                updateFavicon(canvas.toDataURL())
                printField(state)
                if (compareStates(oldstate, state) < stopThreshold) {
                    console.log(`stable after ${iters} iterations (${(iters * tickMS) / 1000}s)`)
                    console.log(`seed: ${seedstring}`)
                    clearInterval(inter)
                }
                iters++
            }, tickMS)
            /// draw
            printField(state)
            drawField(state, ctx)
            updateFavicon(canvas.toDataURL())
        },
        false
    )
})

function updateFavicon(newImg) {
    if (!newImg) {
        return
    }
    icon.href = newImg
}
