
const B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-"
const B64_CODES = {}

B64_CHARS.split("").forEach((char, i) => {
    B64_CODES[char] = i
})


export {B64_CODES, B64_CHARS}


// Notes on charset encoding
//  - We can have 5bit fixed width charset (encoding 32 values)
//      - Here the goal is to find a charset that has all used characters
//      - A fixed with charset is used if it covers all chars in a diagram
//  - We can have a variable width charset with 4bits per 5yte (5bit word)
//      - Here the goal is to have a charset with only the 16 most common values
//      - The charset that overlaps the most common characters best is used
//  - We have 6bits to encode what type of charset we're using
//
// character frequencies from
// https://link.springer.com/content/pdf/10.3758/BF03195586.pdf
const CHARSET_PARTS = [
    " \n-|+",
    ".'_~:=",
    "<>^VOo*",
    "ABCD0123",
    "#()[]`\"",
    "etanisrhldcumfpgywbvkTSAM0o",
    "01234ABCxyzDEF56789nm",
    // "─┌┐└┘├┤┬┴┼╭╮╯╰═╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬",
    // "ETAONISRHLDCUMFPGYWBVK",
    // "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
]
const CP = CHARSET_PARTS

export const CHARSET_INDEX_COORDS = 0

const VAR_WIDTH_CHARSETS = [
    "0123456789+-e. \n",      // for coordinates
    (CP[0] + CP[1] + CP[2]).slice(0, 16),
    (CP[0] + CP[2] + CP[1]).slice(0, 16),
    (CP[0] + CP[3] + CP[1]).slice(0, 16),
    (CP[0] + CP[4] + CP[1]).slice(0, 16),
    (CP[0] + CP[5] + CP[1]).slice(0, 16),
]
const FIX_WIDTH_CHARSETS = [
    (CP[0] + CP[1] + CP[2] + CP[3] + CP[4]).slice(0, 32),
    (CP[0] + CP[1] + CP[2] + CP[4] + CP[3]).slice(0, 32),
    (CP[0] + CP[1] + CP[2] + CP[5]).slice(0, 32),
    (CP[0] + CP[1] + CP[5]).slice(0, 32),
    (CP[0] + CP[5]).slice(0, 32),
    (CP[0] + CP[1] + CP[6]).slice(0, 32),
    (CP[0] + CP[2] + CP[6]).slice(0, 32),
    (CP[0] + CP[1] + CP[2] + CP[6]).slice(0, 32),
]
// We could have many more charsets, but since every charset
// consumes a slot that has to be maintained for backwards compatability,
// I won't fill these out any further. Maybe we want to generate more
// programatically based on usage in the wild.

export const CHARSETS = VAR_WIDTH_CHARSETS.concat(FIX_WIDTH_CHARSETS)

function makeCharCounts(msg) {
    var charCounts = {}
    for (var i = 0; i < msg.length; i++) {
        charCounts[msg[i]] = (charCounts[msg[i]] || 0) + 1
    }
    return charCounts
}

export function makeCharset(msg) {
    var charCounts = makeCharCounts(msg)
    var charCountEntries = Object.entries(charCounts)
    charCountEntries.sort((a, b) => b[1] - a[1])
    var charset = charCountEntries.map((char_count) => char_count[0])
    return charset.join("")
}

export function pickCharsetIndex(msg) {
    var charCounts = makeCharCounts(msg)
    var searchCharset = makeCharset(msg).split("")
    var bestVarCharsetIndex = -1
    var bestVarCharsetWeight = -1

    for (var i = 0; i < CHARSETS.length; i++) {
        var charsetSet = new Set(CHARSETS[i])
        var intersection = searchCharset.filter((char) => charsetSet.has(char))
        if (intersection.length == searchCharset.length) {
            return i
        }
        if (charsetSet.size != 16) {continue}

        var weight = 0
        for (var j = 0; j < intersection.length; j++) {
            weight += charCounts[intersection[j]]
        }
        if (bestVarCharsetWeight < weight) {
            bestVarCharsetIndex = i
            bestVarCharsetWeight = weight
        }
    }
    return bestVarCharsetIndex
}


function makeCharsetCodes(charset) {
    var codes = new Map()
    charset.split("").forEach((char, i) => {
        codes.set(char, i)
    })
    return codes
}


export function encodeVarWidth(msg, charset) {
    // Encode an arbitrary string to a limited character alphabet
    // Uses a variable width encoding similar to utf-8
    console.assert(charset.length == 16)
    var charCodes = makeCharsetCodes(charset)

    function toCharCode(char) {
        if (charCodes.has(char)) {
            return charCodes.get(char)
        }
        // fallback to multi-nibble utf-16
        var charCode = char.charCodeAt(0)
        console.assert(charCode >= 16)
        return charCode
    }

    var b32Chars = []
    var shift = 4
    var mask = (1 << shift) - 1
    var hasMore = 1 << shift

    for (var i = 0; i < msg.length; i++) {
        var charCode = toCharCode(msg[i])
        do {
            var chunk = charCode & 0xf
            charCode = charCode >> shift
            var b32code = charCode > 0 ? (chunk | hasMore) : chunk
            b32Chars.push(B64_CHARS[b32code])
        } while (charCode > 0)
    }
    return b32Chars.join("")
}


export function decodeVarWidth(b32msg, charset) {
    console.assert(charset.length == 16)

    function fromCharCode(charCode) {
        if (charCode < 16) {
            return charset[charCode]
        }
        return String.fromCharCode(charCode)
    }

    var out = []
    var shift = 4
    var mask = (1 << shift) - 1
    var hasMore = 1 << shift

    var charCode = 0
    var curShift = 0
    for (var i = 0; i < b32msg.length; i++) {
        var code = B64_CODES[b32msg[i]]
        charCode = charCode | ((code & 0xf) << curShift)
        if ((code & 0x10) == 0) {
            out.push(fromCharCode(charCode))
            charCode = 0
            curShift = 0
        } else {
            curShift += 4
        }
    }
    return out.join("")
}


export function encodeFixWidth(msg, charset) {
    var b32chars = []
    var codes = makeCharsetCodes(charset)
    for (var i = 0; i < msg.length; i++) {
        var msgChar = msg[i]
        var msgCode = codes.get(msgChar)
        console.assert(msgCode < 32, msgCode, msgChar)
        b32chars.push(B64_CHARS[msgCode])
    }
    return b32chars.join("")
}


export function decodeFixWidth(b32msg, charset) {
    var msgChars = []
    for (var i = 0; i < b32msg.length; i++) {
        var b32char = b32msg[i]
        var b32Code = B64_CODES[b32char]
        msgChars.push(charset[b32Code])
    }
    return msgChars.join("")
}

export function b32encode(msg, charsetIndex) {
    if (typeof charsetIndex == 'undefined') {
        charsetIndex = pickCharsetIndex(msg)
    }
    var charset = CHARSETS[charsetIndex]

    var b32msg = charset.length == 32 ? encodeFixWidth(msg, charset) : encodeVarWidth(msg, charset)
    // console.log("encode", header, charsetIndex, charset.length, "msg", msg.length, "b32", b32msg.length)
    return b32msg
}


export function b32decode(b32msg, charsetIndex) {
    var charset = CHARSETS[charsetIndex]
    var msg = charset.length == 32 ? decodeFixWidth(b32msg, charset) : decodeVarWidth(b32msg, charset)
    // console.log("decode", header, charsetIndex, charset.length, "msg", msg.length, "b32", b32msg.length)
    return msg
}
