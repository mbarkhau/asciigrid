
// http://www.unicode.org/reports/tr11/
const FULLWIDTH_CHAR_RANGES = [
    [0x1100, 0x115F],
    [0x11A3, 0x11A7],
    [0x11FA, 0x11FF],
    [0x2329, 0x232A],
    [0x2E80, 0x2E99],
    [0x2E9B, 0x2EF3],
    [0x2F00, 0x2FD5],
    [0x2FF0, 0x2FFB],
    [0x3000, 0x303E],
    [0x3041, 0x3096],
    [0x3099, 0x30FF],
    [0x3105, 0x312D],
    [0x3131, 0x318E],
    [0x3190, 0x31BA],
    [0x31C0, 0x31E3],
    [0x31F0, 0x321E],
    [0x3220, 0x3247],
    [0x3250, 0x32FE],
    [0x3300, 0x4DBF],
    [0x4E00, 0xA48C],
    [0xA490, 0xA4C6],
    [0xA960, 0xA97C],
    [0xAC00, 0xD7A3],
    [0xD7B0, 0xD7C6],
    [0xD7CB, 0xD7FB],
    [0xF900, 0xFAFF],
    [0xFE10, 0xFE19],
    [0xFE30, 0xFE52],
    [0xFE54, 0xFE66],
    [0xFE68, 0xFE6B],
    [0xFF01, 0xFF60],
    [0xFFE0, 0xFFE6],
    [0x1B000, 0x1B001],
    [0x1F200, 0x1F202],
    [0x1F210, 0x1F23A],
    [0x1F240, 0x1F248],
    [0x1F250, 0x1F251],
    [0x20000, 0x2FFFD],
    [0x30000, 0x3FFFD],
]

export function isFullWidthChar(char) {
    var code = char.codePointAt(0)
    if (code < 0x1100) {
        return false
    }
    for (var i = 0; i < FULLWIDTH_CHAR_RANGES.length; i++) {
        var [minCode, maxCode] = FULLWIDTH_CHAR_RANGES[i]
        if (minCode <= code && code <= maxCode) {
            return true
        }
    }
    return false
}

export function isMultibyteChar(char) {
    var code = char.codePointAt(0)
    return 0xD800 <= code && code <= 0xDFFF
}

export function addFauxSpaces(text) {
    var newChars = []
    var chars = text.split("")
    for (var i = 0; i < chars.length; i++) {
        var char = chars[i]
        newChars.push(char)
        if (isFullWidthChar(char)) {
            newChars.push(" ")
        }
    }
    return newChars.join("")
}

export function removeFauxSpaces(text) {
    var newChars = []
    var chars = text.split("")
    for (var i = 0; i < chars.length; i++) {
        var char = chars[i]
        newChars.push(char)
        if (isFullWidthChar(char) && chars[i + 1] == " ") {
            i += 1
        }
    }
    return newChars.join("")
}


console.assert(isFullWidthChar("文"))
console.assert(isFullWidthChar("イ"))
console.assert(isFullWidthChar("七"))
console.assert(!isFullWidthChar("ل"))
console.assert(!isFullWidthChar("ä"))
console.assert(!isFullWidthChar("a"))
