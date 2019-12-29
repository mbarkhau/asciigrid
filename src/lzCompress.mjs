import {B64_CHARS, B64_CODES} from "./b64encode.mjs"

const MAX_LOOKBACK = 63
const MIN_PHRASE_LEN = 3
const MAX_PHRASE_LEN = 31 + MIN_PHRASE_LEN

export function compress(b32msg) {
    // an LZ77 or LZSS style encoder
    if (b32msg.length < MIN_PHRASE_LEN + 3) {return b32msg}

    var b64blk = []

    for (var i = 0; i < b32msg.length; i++) {
        console.assert(B64_CODES[b32msg[i]] < 32)
        if (!(MIN_PHRASE_LEN <= i && i <= b32msg.length - MIN_PHRASE_LEN)) {
            b64blk.push(b32msg[i])
            continue
        }

        var maxWinSize = Math.min(MAX_PHRASE_LEN, i, b32msg.length - i)
        var found = false
        for (var winSize = maxWinSize; MIN_PHRASE_LEN <= winSize; winSize--) {
            var searchIdx = i + winSize
            var matchSize = 0
            var relMatchIdx = 0
            while (relMatchIdx <= MAX_LOOKBACK) {
                var matchIdx = i - relMatchIdx
                if (matchIdx <= matchSize) {
                    break
                }
                var searchChar = b32msg[searchIdx - matchSize - 1]
                var matchChar = b32msg[matchIdx - matchSize - 1]

                if (searchChar == matchChar) {
                    matchSize += 1
                } else {
                    relMatchIdx += matchSize + 1
                    matchSize = 0
                }
                if (matchSize == winSize) {
                    break
                }
            }
            if (matchSize == winSize) {
                var matchIdx = i - relMatchIdx
                var match = b32msg.slice(matchIdx - winSize, matchIdx)

                // console.log("...", i, "win", winSize, "match", relMatchIdx, matchIdx, match)

                b64blk.push(B64_CHARS[0x20 | (winSize - MIN_PHRASE_LEN)])
                b64blk.push(B64_CHARS[relMatchIdx])
                i += winSize - 1
                found = true
                break
            }
        }

        if (!found) {
            b64blk.push(b32msg[i])
        }
    }
    return b64blk.join("")
}

export function decompress(b64blk) {
    var b32msg = []

    for (var i = 0; i < b64blk.length; i++) {
        var b64code = B64_CODES[b64blk[i]]
        if (b64code < 0x20) {
            b32msg.push(B64_CHARS[b64code])
        } else {
            var winSize = ((b64code & 0x1f) + MIN_PHRASE_LEN)
            var relMatchIdx = B64_CODES[b64blk[i + 1]]

            var matchIdx = b32msg.length - relMatchIdx
            var match = b32msg.slice(matchIdx - winSize, matchIdx)
            for (var j = 0; j < match.length; j++) {
                b32msg.push(match[j])
            }
            i += 1
        }
    }

    return b32msg.join("")
}
