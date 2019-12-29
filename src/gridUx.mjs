import * as grid from "./gridCalc.mjs"
import * as canvas from "./canvas.mjs"

export const OP_SET = 1
export const OP_DEL = 2
export const OP_MOV = 3

var DEBUG_OPS = [
    {o: OP_SET, x: 0, y:  2, z: 0, v: "       +------+   .-.  +---+      "},
    {o: OP_SET, x: 0, y:  3, z: 0, v: "o--+---| elem |--( A )-| n |--+--o"},
    {o: OP_SET, x: 0, y:  4, z: 0, v: "   |   +------+   '-'  +---+  |   "},
    {o: OP_SET, x: 0, y:  5, z: 0, v: "   | +------>------+          |   "},
    {o: OP_SET, x: 0, y:  6, z: 0, v: "   | |    +---+    |          |   "},
    {o: OP_SET, x: 0, y:  7, z: 0, v: "   +-+-+--| x |--+-+----------+   "},
    {o: OP_SET, x: 0, y:  8, z: 0, v: "   |   |  +---+  |            |   "},
    {o: OP_SET, x: 0, y:  9, z: 0, v: "   |   |   .-.   |            |   "},
    {o: OP_SET, x: 0, y: 10, z: 0, v: "   |   '--( B )--'            ^   "},
    {o: OP_SET, x: 0, y: 11, z: 0, v: "   |       '-'                |   "},
    {o: OP_SET, x: 0, y: 12, z: 0, v: "   |  +-------->---------+    |   "},
    {o: OP_SET, x: 0, y: 13, z: 0, v: "   |  |   +---+   .-.    |    |   "},
    {o: OP_SET, x: 0, y: 14, z: 0, v: "   +--+-+-| x |--( C )-+-+----+   "},
    {o: OP_SET, x: 0, y: 15, z: 0, v: "        | +---+   '-'  |          "},
    {o: OP_SET, x: 0, y: 16, z: 0, v: "        '-------<------'          "},
    {o: OP_SET, x: 3, y: 18, z: 0, v: "Hello\nWorld!"},
    {o: OP_SET, x: 12, y: 18, z: 0, v: "イ ërnâ七 iônàنلzætiøn 🐶"},

    {o: OP_SET, x: 0, y: 21, z: 0, v: ".------------. | .-----------. |  .-----.  "},
    {o: OP_SET, x: 0, y: 22, z: 0, v: "|  文 件 系 统   | | |  调 度 器    | |  | MMU | "},
    {o: OP_SET, x: 0, y: 23, z: 0, v: "'------------' | '-----------' |  '-----'  "},
]

export function initState(width, height) {
    return {
        // Modes: select, brush
        tool: 'select',
        ops: DEBUG_OPS,
        opsLen: DEBUG_OPS.length,
        cells: {},  // derived from ops

        cursorX: 0,     // aka cell
        cursorY: 0,     // aka row
        cursorZ: 0,     // aka layer

        gridVis: 5,
        layerVis: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

        scale: 1,
        scaleBase: 7 / 8,
        scaleExp: 0,
        width: width,
        height: height,
        charW: canvas.CHARW,
        charH: canvas.CHARH,
        offsetPixX: Math.round(width / 10),
        offsetPixY: Math.round(height / 10),
        dirtyCells: true,
        dirtyCanvas: true,
        lastRenderRequest: Date.now(),
        lastRenderStarted: 0,
        lastRenderComplete: 0,

        selects: [
            {x: 0, y: 0, w: 1, h: 1},
        ],
    }
}


export function pushOp(state, op) {
    if (typeof op.z == 'undefined') {
        op.z = state.cursorZ
    }
    var isSelectOp = (
        typeof op.x != 'undefined' &&
        typeof op.y != 'undefined' &&
        typeof op.w != 'undefined' &&
        typeof op.h != 'undefined'
    )

    if (isSelectOp && op.w < 0) {
        op.x += op.w
        op.w = -op.w
    }
    if (isSelectOp && op.h < 0) {
        op.y += op.h
        op.h = -op.h
    }

    if (op.o == OP_MOV || op.o == OP_DEL) {
        // noop if nothing is selected
        var selectedCells = grid.cellsInBounds(state, op, state.cells)
        if (selectedCells.length == 0) {return}
    }

    state.dirtyCells = true
    state.dirtyCanvas = true

    if (op.o == OP_MOV) {
        // try to merge consecutive OP_MOV
        var prevOp = state.ops[state.opsLen - 1]
        var isMergable = (
            prevOp.o == OP_MOV &&
            op.w == prevOp.w &&
            op.h == prevOp.h &&
            op.x == prevOp.x + prevOp.dx &&
            op.y == prevOp.y + prevOp.dy &&
            op.z == prevOp.z + prevOp.dz
        )

        if (isMergable) {
            prevOp.dx += op.dx
            prevOp.dy += op.dy
            var isNoop = prevOp.dx == 0 && prevOp.dy == 0 && prevOp.dz == 0
            if (isNoop) {state.opsLen -= 1}
            return
        }
    }

    state.ops[state.opsLen] = op
    state.opsLen += 1
    state.ops.length = state.opsLen
}
