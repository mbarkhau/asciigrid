import * as unicode from "./unicode.mjs"

export var CHARW = 16
export var CHARH = 32


export function zoom(state, dir, coords) {
    state.scaleExp = Math.max(-10, Math.min(4, state.scaleExp + dir))
    var newScale = Math.pow(state.scaleBase, state.scaleExp)

    if (newScale == state.scale) {
        return
    }
    // https://stackoverflow.com/a/30410948/62997
    // the viewport pre-zoomed and the viewport post-zoomed
    // have the same zoompoint relative to the viewport

    var offsetCoordX = coords.x - state.offsetPixX
    var offsetCoordY = coords.y - state.offsetPixY

    var scaleChange = newScale / state.scale

    state.offsetPixX = Math.round(coords.x - offsetCoordX * scaleChange)
    state.offsetPixY = Math.round(coords.y - offsetCoordY * scaleChange)

    state.scale = newScale
    state.charW = CHARW * state.scale
    state.charH = CHARH * state.scale
}


function drawGridPattern(state, pCtx, step, color) {
    var pattern_w = state.charW * 12
    var pattern_h = state.charH * 12

    var step_px_w = state.charW * step
    var step_px_h = state.charH * step

    pCtx.strokeStyle = color
    pCtx.lineWidth = 1

    pCtx.beginPath()
    for (var x = 1; x < pattern_w; x += step_px_w) {
        for (var y = 0; y <= pattern_h; y += 8) {
            pCtx.moveTo(x, y + 2)
            pCtx.lineTo(x, y + 4)
        }
    }
    for (var y = 1; y < pattern_h; y += step_px_h) {
        for (var x = 0; x <= pattern_w; x += 8) {
            pCtx.moveTo(x + 2, y)
            pCtx.lineTo(x + 4, y)
        }
    }
    pCtx.stroke()
    pCtx.closePath()
}

export function updateGridPattern(ctx, state, gridState) {
    var isPatternFresh = (
        gridState.pattern &&
        gridState.scale == state.scale &&
        gridState.visibility == state.gridVis
    )
    if (isPatternFresh) {
        return
    }

    gridState.scale = state.scale
    gridState.visibility = state.gridVis

    var pattern_w = state.charW * 12
    var pattern_h = state.charH * 12

    var pCanvas = document.createElement('canvas')
    var pCtx = pCanvas.getContext('2d')
    pCanvas.width = pattern_w
    pCanvas.height = pattern_h

    if (gridState.visibility >= 20 && gridState.scale >= 1) {
        drawGridPattern(state, pCtx, 1, `rgba(255, 255, 255, ${gridState.visibility / 50})`)
    }
    if (gridState.visibility >= 10 && gridState.scale >= 0.8) {
        drawGridPattern(state, pCtx, 3, `rgba(255, 255, 255, ${gridState.visibility / 20})`)
    }
    if (gridState.visibility >= 1) {
        drawGridPattern(state, pCtx, 12, `rgba(255, 255, 255, ${gridState.visibility / 10})`)
    }
    gridState.pattern = ctx.createPattern(pCanvas, 'repeat')
}


export function drawGrid(ctx, state, gridState) {
    var pattern_w = state.charW * 12
    var pattern_h = state.charH * 12

    updateGridPattern(ctx, state, gridState)

    var translateX = state.offsetPixX % pattern_w
    var translateY = state.offsetPixY % pattern_h

    ctx.fillStyle = gridState.pattern

    for (var x = translateX - pattern_w; x < state.width + pattern_w; x+=pattern_w) {
        for (var y = translateY - pattern_h; y < state.height + pattern_h; y+=pattern_h) {
            ctx.translate(Math.round(x - pattern_w), Math.round(y - pattern_h))
            ctx.fillRect(Math.round(x), Math.round(y), pattern_w * 2, pattern_h * 2)
            ctx.translate(-Math.round((x - pattern_w)), -Math.round(y - pattern_h))
        }
    }

    ctx.strokeStyle = "#8888"
    ctx.lineWidth = Math.ceil(state.charW / 12)
    ctx.beginPath()

    ctx.moveTo(state.offsetPixX, -pattern_h)
    ctx.lineTo(state.offsetPixX, state.height + pattern_h)

    ctx.moveTo(-pattern_w, state.offsetPixY)
    ctx.lineTo(state.width + pattern_w, state.offsetPixY)

    // Grid rendering debug code
    // ctx.strokeStyle = "#F00"
    // for (var x = translateX - pattern_w; x < state.width + pattern_w; x+=pattern_w) {
    //     ctx.moveTo(x, -pattern_h)
    //     ctx.lineTo(x, state.height + pattern_h)
    // }
    // for (var y = translateY - pattern_h; y < state.height + pattern_h; y+=pattern_h) {
    //     ctx.moveTo(-pattern_w, y)
    //     ctx.lineTo(pattern_w + state.width, y)
    // }

    ctx.stroke()
    ctx.closePath()
}


export function drawSelects(ctx, state) {
    for (var i = 0; i < state.selects.length; i++) {
        var sel = state.selects[i]
        var x = state.offsetPixX + sel.x * state.charW
        var y = state.offsetPixY + sel.y * state.charH
        var w = sel.w * state.charW
        var h = sel.h * state.charH

        ctx.fillStyle = "#AAA5"
        ctx.fillRect(x + 1, y + 1, w - 2, h - 2)
        ctx.lineWidth = 2
        ctx.strokeStyle = "#CCC"
        ctx.strokeRect(x + 1, y + 1, w - 2, h - 2)
    }
}


export function drawCells(ctx, state, cellVals) {
    ctx.font = Math.round(state.charH * 0.8) + "px " + '"Fira Code", monospace'
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    var overdrawX = state.charW * 2
    var overdrawY = state.charH * 2

    var visMinX = - overdrawX
    var visMinY = - overdrawY
    var visMaxX = state.width + overdrawX
    var visMaxY = state.height + overdrawY

    var charOffsetX = state.charW * 1 / 2
    var charOffsetY = state.charH * 3 / 5

    for (var i = 0; i < cellVals.length; i++) {
        var cv = cellVals[i]
        var x = cv.x * state.charW + state.offsetPixX
        var y = cv.y * state.charH + state.offsetPixY
        if (unicode.isFullWidthChar(cv.v)) {
            x = x + state.charW / 2
        }
        x = Math.round(x)
        y = Math.round(y)
        if (visMinX <= x && x < visMaxX && visMinY <= y && y < visMaxY) {
            ctx.fillText(cv.v, x + charOffsetX, y + charOffsetY)
        }
    }
}
