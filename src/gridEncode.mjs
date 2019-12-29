import * as b64 from "./b64encode.mjs"
import * as lz from "./lzCompress.mjs"
import * as grid from "./gridCalc.mjs"
import * as ux from "./gridUx.mjs"


function bitsToB32(bits) {
    var bitarr = typeof bits == "string" ? bits.split("") : bits.slice()
    bitarr.reverse()
    var num = parseInt(bitarr.join(""), 2)
    return num.toString(32)
}


function b32ToBits(b32) {
    var num = parseInt(b32, 32)
    var bits = num.toString(2).split("")
    bits.reverse()
    return bits.join("")
}


function dumpBitArray(bitArray) {
    var chunks = []
    for (var i = 0; i < bitArray.length; i += 30) {
        var bits = bitArray.slice(i, i + 30)
        var chunk = bitsToB32(bits)
        chunks.push(bits.length < 30 ? chunk : chunk.padStart(6, "0"))
    }
    return chunks.join("")
}


function loadBitArray(data) {
    var res = ""
    for (var ci = 0; ci < data.length; ci += 6) {
        var chunk = data.slice(ci, ci + 6)
        var bits = b32ToBits(chunk).padEnd(30, "0")
        res += bits
    }
    return res.split("").map((x) => parseInt(x))
}

export function dumpSaveData(state, cells) {
    var cellVals = Object.values(cells)
    var isCanvasEmpty = typeof grid.cellBounds(cellVals) == 'undefined'
    if (isCanvasEmpty) {return ""}

    // DrawASCII v0 Format
    //
    // The purpose of this encoding is to make it feasable to
    //      1. include links in documents that fully represent the diagram
    //      2. remove the need for any server side persistence
    //
    // To enable 1. (and not at all because I like golfing) the
    // encoding is quite compact.
    //
    // charset:
    //    the set of all characters used in cells, ordered by most to least
    //    common. all encodings reference positions in this charset
    //
    // envelope
    //    header;layerData;layerData;...
    // header:
    //    layerVisBitmap
    // layerData:
    //    l0x;l0y;l1x;l1y;data_lzw
    //
    //  - lx/ly are grid coordinate offsets that are applied to all encoded coordinates.
    //    This is done so that the encoding coordinates can all be 1. positive and 2. small
    //  - the set of strides and bitmaps for each layer (z) is encoded separately
    //  - bitmap encoding is only used if it leads to an encoding that is shorter overall

    var layerOffsets = {}
    Object.values(cells).forEach((cv) => {
        var lo = layerOffsets[cv.z]
        if (!lo) {
            layerOffsets[cv.z] = {x: cv.x, y: cv.y}
        } else {
            layerOffsets[cv.z] = {x: Math.min(lo.x, cv.x), y: Math.min(lo.y, cv.y)}
        }
    })

    var layers = {}
    var loCoords = []

    var cellKeys = Object.keys(cells)
    cellKeys.sort()
    cellKeys.forEach((key) => {
        var cv = cells[key]
        var lo = layerOffsets[cv.z]
        if (!layers[cv.z]) {
            layers[cv.z] = {x: lo.x, y: lo.y, cells: []}
            loCoords.push(lo.x)
            loCoords.push(lo.y)
            loCoords.push(cv.z)
        }
        layers[cv.z].cells.push({x: cv.x - lo.x, y: cv.y - lo.y, v: cv.v})
    })

    const loData = loCoords.join(" ")
    const loDataB32 = b64.b32encode(loData, b64.CHARSET_INDEX_COORDS)

    var layerTexts = Object.entries(layers).map(([z, layer]) => {
        var frags = grid.cellsToTextFragments(layer.cells, {minX: 0, minY: 0})
        return frags.join("")
    })

    const layerVisData = dumpBitArray(state.layerVis)
    const charsetIndex = b64.pickCharsetIndex(layerTexts.join(""))
    const charsetData = b64.B64_CHARS[charsetIndex]
    const header = layerVisData + charsetData
    console.assert(header.length == 3)

    const envelope = [header, loDataB32]

    layerTexts.forEach((text) => {
        const layerData = lz.compress(b64.b32encode(text, charsetIndex))
        envelope.push(layerData)
    })

    return envelope.join(";")
}

export function loadSaveData(state, saveData) {
    if (saveData.length == 0) {return}
    const envelope = saveData.split(";")
    const header = envelope[0]
    const layerVis = loadBitArray(header.slice(0, 2))
    const charsetIndex = b64.B64_CODES[header[2]]
    const loData = b64.b32decode(envelope[1], b64.CHARSET_INDEX_COORDS)
    const loCoords = loData.split(" ").map((n) => parseInt(n))

    const lo = {}
    for (var loI = 0; loI < loCoords.length; loI+=3) {
        var [x, y, z] = loCoords.slice(0, 3)
        lo[z] = {x, y}
    }

    state.ops.length = 0
    state.opsLen = 0

    for (var i = 2; i < envelope.length; i++) {
        var b32Data = lz.decompress(envelope[i])
        var text = b64.b32decode(b32Data, charsetIndex)
        ux.pushOp(state, {o: ux.OP_SET, x: lo[0].x, y: lo[0].y, z: 0, v: text})
    }

    state.dirtyCanvas = true
    state.dirtyCells = true
}
