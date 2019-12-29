import * as testdata from "./testdata.mjs"
import * as b64 from "./b64encode.mjs"
import * as lz from "./lzCompress.mjs"
import * as encGrid from "./gridEncode.mjs"

function log() {
    var args = Array.from(arguments).map((arg) => ("" + arg).replace("\n", "\\n"))
    console.log(...args)
}

b64.CHARSETS.forEach((charset) => {
    var size = charset.length
    var bits = Math.log2(size)
    console.assert(bits == 4 || bits == 5)
    console.assert(new Set(charset).size == size)
})

testdata.DIAG_STRINGS.forEach((diagStr, i) => {
    var charset = b64.makeCharset(diagStr)
    var charsetIndex = b64.pickCharsetIndex(diagStr)
    console.assert(charsetIndex >= 0)
    console.assert(b64.CHARSETS[charsetIndex].length >= 0)

    var b32msg = b64.b32encode(diagStr, charsetIndex)
    var diagStr_b32rt = b64.b32decode(b32msg, charsetIndex)

    if (diagStr != diagStr_b32rt) {
        log("!!", i, charsetIndex, "out", b32msg.length)
        log("in", diagStr.length, "rt", diagStr_b32rt.length, diagStr == diagStr_b32rt)
        throw Error(`Invalid b32encoding for DIAG_STRING[${i}]`)
    }

    var lz64 = lz.compress(b32msg)
    var diagStr_lz64rt = lz.decompress(lz64)
    if (b32msg != diagStr_lz64rt) {
        throw Error(`Invalid lz.compress/decompress for DIAG_STRING[${i}]`)
    }
    var diagStr_fullrt = b64.b32decode(diagStr_lz64rt, charsetIndex)
    if (diagStr_fullrt != diagStr) {
        throw Error(`Invalid encode round-trip for DIAG_STRING[${i}]`)
    }
    // log("in", diagStr.length, "rt", diagStr_fullrt.length)
    // log("b32", b32msg.length, "lz", lz64.length)
})


    // var test_string_small = "Hello, hello 🐶"
    // var test_string_u32 = lz.compress(test_string_small)
    // var test_string_rt = lz.decompress(test_string_u32)
    // console.log("---", enc.b32encode(test_string_small))
    // console.log("---", test_string_u32)
    // console.log("<", test_string_rt.length, test_string_rt)

    // var test_string_small = "ABRACADABRARRAY"
    // var test_string_u32 = lz.compress(test_string_small)
    // var test_string_rt = lz.decompress(test_string_u32)
    // console.log("---", enc.b32encode(test_string_small))
    // console.log("---", test_string_u32)
    // console.log("<", test_string_rt.length, test_string_rt)

    // var test_string = testdata.DIAG_STRINGS[0]
    // var test_string_u32 = lz.compress(test_string)
    // var test_string_rt = lz.decompress(test_string_u32)
    // console.log("<", test_string_rt == test_string, test_string_1.length, test_string_u32.length)
