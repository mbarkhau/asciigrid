
export function cellBounds(cellVals) {
    if (cellVals.length == 0) {return}

    var minX = 10000000
    var minY = 10000000
    var maxX = -10000000
    var maxY = -10000000
    for (var i = 0; i < cellVals.length; i++) {
        var cell = cellVals[i]
        minX = Math.min(minX, cell.x)
        maxX = Math.max(maxX, cell.x)
        minY = Math.min(minY, cell.y)
        maxY = Math.max(maxY, cell.y)
    }
    return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
    }
}

export function cellsInBounds(state, opOrSel, cells) {
    var b = opOrSelectBounds(state, opOrSel)
    var cellVals = Object.values(cells)
    return cellVals.filter(function (cell) {
        return (
            b.minX <= cell.x && cell.x < b.maxX &&
            b.minY <= cell.y && cell.y < b.maxY &&
            b.minZ <= cell.z && cell.z < b.maxZ
        )
    })
}

export function getIntersectedSelect(state, coords) {
    var gx = coords.gridX
    var gy = coords.gridY
    var gz = coords.gridZ
    return state.selects.find(function (sel) {
        var b = opOrSelectBounds(state, sel)
        return (
            b.minX <= gx && gx < b.maxX &&
            b.minY <= gy && gy < b.maxY &&
            b.minZ <= gz && gz < b.maxZ
        )
    })
}

export function opOrSelectBounds(state, opOrSel) {
    // helper to normalize inverted selections (negative width/height)
    var endX = opOrSel.x + opOrSel.w
    var endY = opOrSel.y + opOrSel.h
    var z = typeof opOrSel.z == "undefined" ? state.cursorZ : opOrSel.z
    return {
        minX: opOrSel.x < endX ? opOrSel.x : endX,
        maxX: opOrSel.x < endX ? endX : opOrSel.x,
        minY: opOrSel.y < endY ? opOrSel.y : endY,
        maxY: opOrSel.y < endY ? endY : opOrSel.y,
        minZ: z,
        maxZ: z + 1,
    }
}

export function flatCellVals(cells, layerVis) {
    var cellKeys = Object.keys(cells)
    cellKeys.sort()
    cellKeys.reverse()

    var flatCells = {}
    cellKeys.forEach(function (key) {
        var cell = cells[key]
        if (!layerVis || layerVis[cell.z]) {
            var gridId = key.slice(2)
            if (!flatCells[gridId]) {
                flatCells[gridId] = cell
            }
        }
    })

    var resCellVals = []

    var cellIds = Object.keys(flatCells)
    cellIds.sort()
    for (var i = 0; i < cellIds.length; i++) {
        resCellVals.push(flatCells[cellIds[i]])
    }
    return resCellVals
}

export function cellsToTextFragments(cellVals, bounds) {
    var b = bounds ? bounds : cellBounds(cellVals)
    var frags = []
    var prev = {x: b.minX - 1, y: b.minY}

    // cellVals.sort((a, b) => ((a.z - b.z) || (a.y - b.y) || (a.x - b.x)))
    cellVals.forEach((cv) => {
        var dy = cv.y - prev.y
        if (dy > 0) {
            frags.push("".padStart(dy, "\n"))
            prev.x = b.minX - 1
        }

        var dx = cv.x >= prev.x ? cv.x - prev.x : 0
        if (prev.x < b.minX && cv.x > b.minX) {
            // left padding when cv is offset
            frags.push("".padStart(cv.x - b.minX, " "))
        } else if (dx > 1) {
            // Same line but there is a gap to the previous cell
            frags.push("".padStart(dx - 1, " "))
        }
        frags.push(cv.v)

        prev.x = cv.x
        prev.y = cv.y
    })
    return frags
}
