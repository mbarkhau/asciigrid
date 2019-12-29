import * as enc from "./src/gridEncode.mjs"
import * as grid from "./src/gridCalc.mjs"
import * as ux from "./src/gridUx.mjs"
import * as unicode from "./src/unicode.mjs"
import * as canvas from "./src/canvas.mjs"
import * as menu from "./src/menu.mjs"

const runTests = window.location.search.indexOf("runtests=1")
if (runTests) {import("./src/tests.mjs")}

var w = window
if (w.innerWidth >= w.innerHeight) {
    var WIDTH =  w.innerWidth / 2
    var HEIGHT = w.innerHeight
} else {
    var WIDTH =  w.innerWidth
    var HEIGHT = w.innerHeight / 2
}

var canvasNode = document.getElementById("asciiCanvas")
var clipArea = document.getElementById("clipArea")
clipArea.focus()
var ctx = canvasNode.getContext("2d")
canvasNode.width = WIDTH
canvasNode.height = HEIGHT
menu.init()

const state = ux.initState(WIDTH, HEIGHT)

const saveData = window.location.hash.slice(1)
enc.loadSaveData(state, saveData)

window.addEventListener("hashchange", function(){
    const saveData = window.location.hash.slice(1)
    enc.loadSaveData(state, saveData)
}, false);


function updateCells() {
    console.debug("updateCells")
    function newCellId(cell) {
        // Padded Corrdinate for cellId, this is defined to enable cell ordering
        //
        // A sorted array of cellIds will iterate
        //  - by layer from low  -> high
        //  - by row   from top  -> bottom
        //  - by cell  from left -> right
        var paddedX = (cell.x + 1000 + "").padStart(9, "0")
        var paddedY = (cell.y + 1000 + "").padStart(9, "0")
        return cell.z + ":" + paddedY + ":" + paddedX
    }

    var cells = {}
    for (var i = 0; i < state.opsLen; i++) {
        var op = state.ops[i]
        if (op.o == ux.OP_SET) {
            var charX = op.x
            var charY = op.y
            for (var j = 0; j < op.v.length; j++) {
                var charVal = op.v[j]
                if (unicode.isMultibyteChar(charVal)) {
                    charVal += op.v[j + 1]
                    j += 1
                }
                if (charVal != " " && charVal != "\n") {
                    var cell = {x: charX, y: charY, z: op.z, v: charVal}
                    var cellId = newCellId(cell)
                    cells[cellId] = cell
                }
                if (charVal == "\n") {
                    charX = op.x
                    charY += 1
                } else {
                    charX += 1
                }
            }
        } else if (op.o == ux.OP_DEL || op.o == ux.OP_MOV) {
            var newCells = []

            var selectedCells = grid.cellsInBounds(state, op, cells)
            selectedCells.forEach(function(cell){
                var cellId = newCellId(cell)
                delete cells[cellId]
                if (op.o == ux.OP_MOV) {
                    newCells.push({z: cell.z + op.dz, v: cell.v, x: cell.x + op.dx, y: cell.y + op.dy})
                }
            })
            newCells.forEach(function(cell) {
                var cellId = newCellId(cell)
                if (!(cells[cellId] && cell.z < cells[cellId].z)) {
                    cells[cellId] = cell
                }
            })
        }
    }
    state.cells = cells
    state.dirtyCells = false
    state.lastRenderRequest = Date.now()
    const saveData = enc.dumpSaveData(state, state.cells)
    menu.updateShareURL(saveData)
}

function updateRender() {
    const debounce = Date.now() - state.lastRenderStarted < 1000
    if (debounce) {return}
    const renderRequest = state.lastRenderRequest
    state.lastRenderStarted = renderRequest

    const outputDiv = document.getElementById("render-output")
    const cellVals = grid.flatCellVals(state.cells, state.layerVis)
    if (cellVals.length == 0) {
        outputDiv.innerHTML = ""
        state.lastRenderComplete = renderRequest
        return
    }

    var bobText = grid.cellsToTextFragments(cellVals).join("")
    bobText = unicode.removeFauxSpaces(bobText)
    console.log("fetch svg start, sending", bobText.length, "bytes")

    fetch("https://mbarkhau.pythonanywhere.com/bob2svg", {
        'method'     : 'POST',
        'mode'       : 'cors',
        'credentials': 'omit',
        'body'       : bobText
    }).then((resp) => {
        return resp.text()
    }).then((svgText) => {
        console.log("fetch svg done, got", svgText.length, "bytes")
        // updateSVG(svgText)
        outputDiv.innerHTML = svgText
        var outW = outputDiv.clientWidth
        var outH = outputDiv.clientHeight
        var outAspect = outW / outH

        var svg = document.querySelector("#render-output svg")
        var svgW = svg.clientWidth
        var svgH = svg.clientHeight
        var svgAspect = svgW / svgH

        if (outAspect <= svgAspect) {
            // width limited
            var scale = Math.min(10, outW / svgW)
            var svgPad = Math.round(svgW / 50)
            svg.style.width = "100%"
            svg.style.height = (svgH * scale) + "px"
            svg.style.marginLeft = 0
            svg.style.marginTop = Math.round((outH - (svgH * scale)) / 2) + "px"
            svg.setAttribute("viewBox", `-${svgPad} -${svgPad} ${svgW + svgPad * 2} ${svgH + svgPad * 2}`);
        } else {
            // heigth limited
            var scale = Math.min(10, outH / svgH)
            var svgPad = Math.round(svgH / 50)
            svg.style.width = (svgW * scale) + "px"
            svg.style.height = "100%"
            svg.style.marginTop = 0
            svg.style.marginLeft = Math.round((outW - (svgW * scale)) / 2) + "px"
            svg.setAttribute("viewBox", `-${svgPad} -${svgPad} ${svgW + svgPad * 2} ${svgH + svgPad * 2}`);
        }


        state.lastRenderComplete = renderRequest
    }).catch(() => {
        outputDiv.innerHTML = "Error Rendering SVG"
        state.lastRenderComplete = renderRequest
    })
}

const gridState = {
    pattern: null,
    scale: 0,
    visibility: 0,
}

function updateCanvas() {
    console.debug("updateCanvas")
    ctx.clearRect(0, 0, state.width, state.height)
    canvas.drawGrid(ctx, state, gridState)
    var cellVals = grid.flatCellVals(state.cells, state.layerVis)
    canvas.drawCells(ctx, state, cellVals)
    canvas.drawSelects(ctx, state)
    state.dirtyCanvas = false
}

function pointerCoords(e) {
    const rect = canvasNode.getBoundingClientRect()
    var clientX = (e.touches ? e.touches[0] : e).clientX
    var clientY = (e.touches ? e.touches[0] : e).clientY

    const x = clientX - rect.left
    const y = clientY - rect.top

    return {
        x: x,
        y: y,
        gridX: Math.floor((x - state.offsetPixX) / state.charW),
        gridY: Math.floor((y - state.offsetPixY) / state.charH),
        gridZ: state.cursorZ,
    }
}

var cursor = {}

function onMouseDown(e) {
    var C = e.ctrlKey
    var A = e.altKey
    var S = e.shiftKey
    var coords = pointerCoords(e)
    if (C || e.button == 1) {
        canvasNode.style.cursor = "move"
        cursor.dragStartCoords = coords
        cursor.dragStartOffset = {x: state.offsetPixX, y: state.offsetPixY}
    } else {
        var sel = grid.getIntersectedSelect(state, coords)
        if (!!sel) {
            canvasNode.style.cursor = "grab"
            sel.startX = sel.x
            sel.startY = sel.y
            var grabbedCells = grid.cellsInBounds(state, sel, state.cells)
            cursor.selectStartCoords = coords
            cursor.prevCoords = coords
            cursor.grabbedSel = sel
            cursor.hasGrabbedCells = grabbedCells.length > 0
            var b = grid.opOrSelectBounds(state, sel)
            cursor.grabLoX = b.minX + Math.floor(Math.abs(sel.w) * 1 / 3)
            cursor.grabHiX = b.minX + Math.floor(Math.abs(sel.w) * 2 / 3)
            cursor.grabLoY = b.minY + Math.floor(Math.abs(sel.h) * 1 / 3)
            cursor.grabHiY = b.minY + Math.floor(Math.abs(sel.h) * 2 / 3)
        } else {
            cursor.selectStartCoords = coords
            state.selects.length = 0
            state.selects.push({x: coords.gridX, y: coords.gridY, w: 1, h: 1})
            state.dirtyCanvas = true
        }
    }
}

function onMouseUp(e) {
    canvasNode.style.cursor = "auto"
    cursor.dragStartCoords = null
    cursor.dragStartOffset = null
    cursor.selectStartCoords = null
    cursor.prevCoords = null
    cursor.grabbedSel = null
    cursor.hasGrabbedCells = false
    state.dirtyCanvas = true
    e.preventDefault()
}

function onMouseMove(e) {
    // NOTE: We rely on state.cells being up to date here,
    //  so we have to debounce if it's not.
    if (state.dirtyCells) {
        state.queuedMouseMove = e
        return
    }
    const dsc = cursor.dragStartCoords
    const dso = cursor.dragStartOffset
    const ssc = cursor.selectStartCoords
    const pc = cursor.prevCoords

    if (!dsc && !ssc) {return}

    const coords = pointerCoords(e)

    if (dsc) {
        state.offsetPixX = dso.x + coords.x - dsc.x
        state.offsetPixY = dso.y + coords.y - dsc.y
    }
    if (ssc) {
        var sel = cursor.grabbedSel
        if (!!sel) {
            const dx = coords.gridX - pc.gridX
            const dy = coords.gridY - pc.gridY

            const isHiGrabX  = cursor.grabHiX <= ssc.gridX
            const isLoGrabX  = ssc.gridX <= cursor.grabLoX
            const isHiGrabY  = cursor.grabHiY <= ssc.gridY
            const isLoGrabY  = ssc.gridY <= cursor.grabLoY
            const isMidGrab  = !isHiGrabX && !isLoGrabX && !isHiGrabY && !isLoGrabY

            var hasModKey = e.shiftKey || e.altKey

            if (hasModKey && !isMidGrab) {
                if (isLoGrabX) {
                    resizeSelect(dx, 0, 0, 0, sel)
                } else if (isHiGrabX) {
                    resizeSelect(0, dx, 0, 0, sel)
                }
                if (isLoGrabY) {
                    resizeSelect(0, 0, dy, 0, sel)
                } else if (isHiGrabY) {
                    resizeSelect(0, 0, 0, dy, sel)
                }
            } else {
                if (cursor.hasGrabbedCells && !hasModKey && (dx != 0 || dy != 0)) {
                    ux.pushOp(state, {o: ux.OP_MOV, x: sel.x, y: sel.y, w: sel.w, h: sel.h, dx: dx, dy: dy, dz: 0})
                }
                sel.x += dx
                sel.y += dy
            }
        } else {
            var sel = lastSelect(state)
            if (coords.gridX >= ssc.gridX) {
                sel.x = ssc.gridX
                sel.w = coords.gridX - ssc.gridX + 1
                if (sel.w == 0) {sel.w = 1}
            } else {
                sel.x = ssc.gridX + 1
                sel.w = coords.gridX - ssc.gridX
                if (sel.w == 0) {sel.w = -1}
            }
            if (coords.gridY >= ssc.gridY) {
                sel.y = ssc.gridY
                sel.h = coords.gridY - ssc.gridY + 1
                if (sel.h == 0) {sel.h = 1}
            } else {
                sel.y = ssc.gridY + 1
                sel.h = coords.gridY - ssc.gridY
                if (sel.h == 0) {sel.h = -1}
            }
        }
    }
    cursor.prevCoords = coords
    state.dirtyCanvas = true
}

function onMouseWheel(e) {
    var delta = e.detail || e.deltaY
    if (delta != 0) {
        state.dirtyCanvas = true
        var dir = delta < 0 ? -1: 1
        var coords = pointerCoords(e)
        var C = e.ctrlKey
        var S = e.shiftKey
        if (C) {
            canvas.zoom(state, dir, coords)
        } else if (S) {
            state.offsetPixX -= dir * 36 / state.scale
        } else {
            state.offsetPixY -= dir * 36 / state.scale
        }
    }
    e.preventDefault()
}

function panCanvas(dirX, dirY) {
    state.offsetPixX += dirX * 30
    state.offsetPixY += dirY * 30
}

function moveSelect(dirX, dirY, dirZ) {
    var sel = lastSelect(state)
    sel.x += dirX
    sel.y += dirY
    sel.z += dirZ
}

function resizeSelect(dx1, dx2, dy1, dy2, sel) {
    // update selection with parameters assuming normalized form
    // Helper to abstract away dealing with inverted selections (negative width/height)
    if (dx1 == 0 && dx2 == 0 && dy1 == 0 && dy2 == 0) {return}
    if (!sel) {
        sel = lastSelect(state)
    }
    var dx = sel.w < 0 ? dx2 : dx1
    var dy = sel.h < 0 ? dy2 : dy1
    var dw = sel.w < 0 ? dx1 - dx2 : dx2 - dx1
    var dh = sel.h < 0 ? dy1 - dy2 : dy2 - dy1
    sel.x += dx
    sel.y += dy
    sel.w += dw
    sel.h += dh
    if (sel.w == 0) {sel.w += dw}
    if (sel.h == 0) {sel.h += dh}
}

function getCellExtreem(state, select, dim, dir) {
    var altDim = dim == "x" ? "y" : "x"

}

function moveToEnd(dirX, dirY) {
    var cellVals = Object.values(state.cells)
    var sel = lastSelect(state)

    if (cellVals.length == 0) {
        sel.w = 1
        sel.h = 1
        sel.x = 0
        sel.y = 0
        return
    }
    if (sel.w != 1 || sel.h != 1) {return}

    var minVals = {x: 11, y: 11}
    var maxVals = {x: 0, y: 0}
    var xVals = []
    var yVals = []
    for (var i = 0; i < cellVals.length; i++) {
        var cv = cellVals[i]
        if (cv.z != state.cursorZ) {continue}

        minVals.x = Math.min(cv.x, minVals.x)
        minVals.y = Math.min(cv.y, minVals.y)
        maxVals.x = Math.max(cv.x, maxVals.x)
        maxVals.y = Math.max(cv.y, maxVals.y)

        if (dirX != 0 && cv.y == sel.y && sel.x * dirX < cv.x * dirX) {
            xVals.push(cv.x)
        }
        if (dirY != 0 && cv.x == sel.x && sel.y * dirY < cv.y * dirY) {
            yVals.push(cv.y)
        }
    }

    xVals.sort((a, b) => (a - b) * dirX)
    yVals.sort((a, b) => (a - b) * dirY)

    function moveToExtreem(dim, dir, vals) {
        // Get the extreem value for a dimension (min or max depending on dir)
        if (vals.length == 0) {
            if (dir < 0) {sel[dim] = minVals[dim]}
            if (dir > 0) {sel[dim] = maxVals[dim]}
            return
        }
        var val = vals[0]
        var max_blanks = 2
        for (var i = 1; i < vals.length; i++) {
            var blanks = Math.abs(vals[i] - val)
            if (blanks > max_blanks) {
                break
            } else {
                val = vals[i]
            }
        }
        sel[dim] = val
    }

    moveToExtreem("x", dirX, xVals)
    moveToExtreem("y", dirY, yVals)
}

function resizeSelectToEnd() {
    var sel = lastSelect(state)

}

function undoRedoOp(dir) {
    state.opsLen = Math.min(Math.max(state.opsLen + dir, 0), state.ops.length)
    state.dirtyCells = true
}

function shiftSelect(dirX, dirY, dirZ) {
    var sel = lastSelect(state)
    if (Math.abs(sel.w) > 1 || Math.abs(sel.h) > 1) {
        ux.pushOp(state, {o: ux.OP_MOV, x: sel.x, y: sel.y, w: sel.w, h: sel.h, dx: dirX, dy: dirY, dz: dirZ})
    }
    moveSelect(dirX, dirY, dirZ)
    state.cursorZ += dirZ
}

function selectAll() {
    var b = grid.cellBounds(grid.flatCellVals(state.cells, state.layerVis))
    if (!b) {return}

    var sel = {
        x: b.minX,
        y: b.minY,
        z: state.cursorZ,
        w: b.maxX - b.minX + 1,
        h: b.maxY - b.minY + 1,
    }
    state.selects.length = 0
    state.selects.push(sel)
}

function lastSelect(state) {
    return state.selects[state.selects.length - 1]
}

function delSelect(){
    var sel = lastSelect(state)
    ux.pushOp(state, {o: ux.OP_DEL, x: sel.x, y: sel.y, w: sel.w, h: sel.h})
}

function copyToClipboard(){
    var sel = lastSelect(state)
    var bounds = grid.opOrSelectBounds(state, sel)
    var cellVals = grid.flatCellVals(state.cells, state.layerVis)
    var selectedCellVals = cellVals.filter(function(cv) {
        return (
            bounds.minX <= cv.x && cv.x < bounds.maxX &&
            bounds.minY <= cv.y && cv.y < bounds.maxY
            // ignore cv.z in bounds for copy paste
        )
    })

    var textFragments = grid.cellsToTextFragments(selectedCellVals, bounds)
    var text = textFragments.join("")
    text = unicode.removeFauxSpaces(text)
    clipArea.value = text
    clipArea.select()
    document.execCommand('copy');
}

window.addEventListener('blur', function() {
    clipArea.value = ""
})

function pasteText(text, x, y, z) {
    var sel = lastSelect(state)
    var b = grid.opOrSelectBounds(state, sel)
    x |= b.minX
    y |= b.minY
    z |= state.cursorZ
    text = unicode.addFauxSpaces(text)
    ux.pushOp(state, {o: ux.OP_SET, x: x, y: y, z: z, v: text})
}

function pasteFromClipboard() {
    // NOTE: if we can't get rid of the permission dialog,
    //  then we can at least mitigate the issue for document
    //  internal copy and paste, by detecting page focus and
    //  if none happened, we can just use the contents of the
    //  'clipArea' object
    if (clipArea.value.length > 0) {
        pasteText(clipArea.value)
    } else if (navigator.clipboard.readText) {
        navigator.clipboard.readText().then(function (clipText){
            clipArea.value = clipText
            clipArea.select()
            pasteText(clipText)
        })
    }
}

function eraseAndMoveSelect(dir) {
    // We might do special things here, based on what is under the
    // cursor.
    if (dir < 0) {
        moveSelect(dir, 0, 0)
        delSelect()
    } else {
        delSelect()
        moveSelect(dir, 0, 0)
    }
}

function toggleLayerVis(z) {
    console.debug("toggleLayerVis", z, state.layerVis[z])
    state.layerVis[z] = (state.layerVis[z] + 1) % 2
    state.dirtyCells = true
    state.dirtyCanvas = true
}

function toggleGridVis() {
    state.gridVis = state.gridVis > 0 ? 0 : 10
    state.dirtyCanvas = true
}

function onKeyDown(e) {
    var key = {
        C: e.ctrlKey,
        S: e.shiftKey,
        A: e.altKey,
        key: e.key,
        code: e.code,
        isMeta: (
            e.code.slice(0, 3) == 'Alt' ||
            e.code.slice(0, 4) == 'Meta' ||
            e.code.slice(0, 5) == 'Shift' ||
            e.code.slice(0, 7) == 'Control' ||
            e.code == 'ContextMenu'
        ),
    }
    if (key.isMeta) {return}

    var centerCoords = {x: state.width / 2, y: state.height / 2};

    var callback = (
        (key.C && key.S) ? (
            // NOTE: Disable layers until UX for it is done
            // key.code == 'Digit1' ? function(){shiftSelect(0, 0, 0 - state.cursorZ)} :
            // key.code == 'Digit2' ? function(){shiftSelect(0, 0, 1 - state.cursorZ)} :
            // key.code == 'Digit3' ? function(){shiftSelect(0, 0, 2 - state.cursorZ)} :
            // key.code == 'Digit4' ? function(){shiftSelect(0, 0, 3 - state.cursorZ)} :
            // key.code == 'Digit5' ? function(){shiftSelect(0, 0, 4 - state.cursorZ)} :
            // key.code == 'Digit6' ? function(){shiftSelect(0, 0, 5 - state.cursorZ)} :
            // key.code == 'Digit7' ? function(){shiftSelect(0, 0, 6 - state.cursorZ)} :
            // key.code == 'Digit8' ? function(){shiftSelect(0, 0, 7 - state.cursorZ)} :
            // key.code == 'Digit9' ? function(){shiftSelect(0, 0, 8 - state.cursorZ)} :
            // key.code == 'Digit0' ? function(){shiftSelect(0, 0, 9 - state.cursorZ)} :
            null
        ) :
        key.C ? (
            // key.code == 'Digit1' ? function(){state.cursorZ = 0} :
            // key.code == 'Digit2' ? function(){state.cursorZ = 1} :
            // key.code == 'Digit3' ? function(){state.cursorZ = 2} :
            // key.code == 'Digit4' ? function(){state.cursorZ = 3} :
            // key.code == 'Digit5' ? function(){state.cursorZ = 4} :
            // key.code == 'Digit6' ? function(){state.cursorZ = 5} :
            // key.code == 'Digit7' ? function(){state.cursorZ = 6} :
            // key.code == 'Digit8' ? function(){state.cursorZ = 7} :
            // key.code == 'Digit9' ? function(){state.cursorZ = 8} :
            // key.code == 'Digit0' ? function(){state.cursorZ = 9} :

            key.code == 'ArrowLeft'  ? function(){panCanvas(1, 0)} :
            key.code == 'ArrowRight' ? function(){panCanvas(-1, 0)} :
            key.code == 'ArrowUp'    ? function(){panCanvas(0, 1)} :
            key.code == 'ArrowDown'  ? function(){panCanvas(0, -1)} :

            key.key == "#" ? function(){toggleGridVis()} :

            key.key == "a" ? function(){selectAll()} :
            key.key == "c" ? function(){copyToClipboard()} :
            key.key == "x" ? function(){copyToClipboard();delSelect()} :
            // For firefox compat, we have to do this via the paste event
            // key.key == "v" ? function(){pasteFromClipboard()} :

            key.key == "z" ? function(){undoRedoOp(-1)} :
            key.key == "y" ? function(){undoRedoOp(1)} :

            key.key == "0" ? function(){canvas.zoom(state, -state.scaleExp, centerCoords)} :
            key.key == "+" ? function(){canvas.zoom(state, -1, centerCoords)} :
            key.key == "-" ? function(){canvas.zoom(state, 1, centerCoords)} :

            null
        ) :
        key.A ? (
            // key.code == 'Digit1' ? function(){toggleLayerVis(0)} :
            // key.code == 'Digit2' ? function(){toggleLayerVis(1)} :
            // key.code == 'Digit3' ? function(){toggleLayerVis(2)} :
            // key.code == 'Digit4' ? function(){toggleLayerVis(3)} :
            // key.code == 'Digit5' ? function(){toggleLayerVis(4)} :
            // key.code == 'Digit6' ? function(){toggleLayerVis(5)} :
            // key.code == 'Digit7' ? function(){toggleLayerVis(6)} :
            // key.code == 'Digit8' ? function(){toggleLayerVis(7)} :
            // key.code == 'Digit9' ? function(){toggleLayerVis(8)} :
            // key.code == 'Digit0' ? function(){toggleLayerVis(9)} :

            key.code == 'ArrowLeft'  ? function(){moveSelect(-1, 0, 0)} :
            key.code == 'ArrowRight' ? function(){moveSelect(1, 0, 0)} :
            key.code == 'ArrowUp'    ? function(){moveSelect(0, -1, 0)} :
            key.code == 'ArrowDown'  ? function(){moveSelect(0, 1, 0)} :

            null
        ) :
        key.S ? (
            key.code == 'ArrowLeft'  ? function(){lastSelect(state).w -= 1} :
            key.code == 'ArrowRight' ? function(){lastSelect(state).w += 1} :
            key.code == 'ArrowUp'    ? function(){lastSelect(state).h -= 1} :
            key.code == 'ArrowDown'  ? function(){lastSelect(state).h += 1} :
            key.code == 'Home'       ? function(){resizeSelectToEnd(-1, 0)} :
            key.code == 'End'        ? function(){resizeSelectToEnd(1, 0)} :
            null
        ) :
        key.code == 'Escape'     ? function(){var sel = lastSelect(state); sel.w = 1, sel.h = 1} :
        key.code == 'Space'      ? function(){eraseAndMoveSelect(1)} :
        key.code == 'Backspace'  ? function(){eraseAndMoveSelect(-1)} :
        key.code == 'Delete'     ? function(){delSelect()} :
        key.code == 'Enter'      ? function(){moveToEnd(-1);moveSelect(0, 1, 0)} :
        key.code == 'Home'       ? function(){moveToEnd(-1, 0)} :
        key.code == 'End'        ? function(){moveToEnd(1, 0)} :
        key.code == 'PageUp'     ? function(){moveToEnd(0, -1)} :
        key.code == 'PageDown'   ? function(){moveToEnd(0, 1)} :
        key.code == 'ArrowLeft'  ? function(){shiftSelect(-1, 0, 0)} :
        key.code == 'ArrowRight' ? function(){shiftSelect(1, 0, 0)} :
        key.code == 'ArrowUp'    ? function(){shiftSelect(0, -1, 0)} :
        key.code == 'ArrowDown'  ? function(){shiftSelect(0, 1, 0)} :
        null
    )
    console.debug(key.code, key.key)

    state.dirtyCanvas = true

    if (!!callback) {
        callback(key, e)
        e.preventDefault()
    } else {
        var sel = lastSelect(state)
        var isChar = key.key.length == 1
        if (!key.C && !key.A && isChar) {
            var char = key.key
            ux.pushOp(state, {o: ux.OP_SET, x: sel.x, y: sel.y, v: char})
            sel.w = 1
            sel.h = 1
            sel.x += 1
            e.preventDefault()
        }
    }
}

// TODO: this is bad UX, it should be this
//  one finger drag: select/move select
//  two finger drag: pan
//  two finger stretch: zoom
function onTouchStart(e) {
    const coords = pointerCoords(e)
    cursor.dragStartCoords = coords
    cursor.dragStartOffset = {x: state.offsetPixX, y: state.offsetPixY}
}

function onTouchMove(e) {
    const coords = pointerCoords(e)
    cursor.lastTouchCoords = coords
    const dsc = cursor.dragStartCoords
    const dso = cursor.dragStartOffset
    state.offsetPixX = dso.x + coords.x - dsc.x
    state.offsetPixY = dso.y + coords.y - dsc.y
    state.dirtyCanvas = true
    e.preventDefault()
}

function onTouchEnd(e) {
    const a = cursor.dragStartCoords
    const b = cursor.lastTouchCoords
    if (a && b && a.x == b.x && a.y == b.y) {
        const sel = lastSelect()
        sel.x = a.x
        sel.y = a.y
    }
}

function onTouchCancel(e) {}

canvasNode.addEventListener('mousedown', onMouseDown)
canvasNode.addEventListener('mouseup', onMouseUp)
canvasNode.addEventListener('mousemove', onMouseMove)
canvasNode.addEventListener('mousewheel', onMouseWheel)
canvasNode.addEventListener('DOMMouseScroll', onMouseWheel)
canvasNode.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    return false
})


document.body.addEventListener('keydown', onKeyDown)

canvasNode.addEventListener("touchstart", onTouchStart, false);
canvasNode.addEventListener("touchend", onTouchEnd, false);
canvasNode.addEventListener("touchcancel", onTouchCancel, false);
canvasNode.addEventListener("touchmove", onTouchMove, false);


window.addEventListener('paste', (e) => {
    clipArea.value = e.clipboardData.getData('text/plain')
    pasteFromClipboard()
    e.preventDefault()
})

var debug = 0

function drawLoop() {
    if (debug) {
        state.tick = Date.now() / 120
        state.offsetPixX = Math.cos(state.tick / 20) * 200 + 120
        state.offsetPixY = Math.sin(state.tick / 20) * 200 + 120
        state.dirtyCells = true
        state.dirtyCanvas = true
        state.scale = 1.5 + Math.sin(state.tick / 20)
    }
    if (state.dirtyCells) {
        updateCells()
        if (state.queuedMouseMove) {
            onMouseMove(state.queuedMouseMove)
            state.queuedMouseMove = null
        }
    }
    if (state.dirtyCanvas) {
        updateCanvas()
    }

    var isRenderRequested = state.lastRenderRequest > state.lastRenderComplete
    var isRendering = state.lastRenderComplete < state.lastRenderStarted
    if (isRenderRequested && !isRendering) {
        updateRender()
    }
    requestAnimationFrame(drawLoop)
}

document.fonts.load('500 12pt "Fira Code"').then(drawLoop, drawLoop)
