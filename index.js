`use strict`
const canvas = document.querySelector(`canvas`)
const ctx = canvas.getContext(`2d`)
canvas.width = 3000
canvas.height = 2000

function randomOrder(len) {
    let arr = []
    for (let i = 0; i < len; i++) arr.push(Math.random())
    arr.sort(function (a, b) {
        return a - b
    })
    return arr.map(function (...args) {
        return args[1]
    })
}

function amazing(a) {
    return `0123456789abcdef`[a]
}

function getColourOf(no) {
    if(no <= 15) return `f${amazing(no)}0`
    if(no <= 30) return `${amazing(30 - no)}f0`
    let next = getColourOf(no - 30)
    return `${next[2]}${next[0]}${next[1]}`
}

/**
 * @type { Boolean }
 */
let aPressed = false
/**
 * @type { Boolean }
 */
let sPressed = false
/**
 * @type { Boolean }
 */
let dPressed = false
/**
 * @type { Boolean }
 */
let wPressed = false

document.addEventListener(`keydown`, function ({ code }) {
    if(code == `KeyA`) {
        aPressed = true
        return
    }
    if(code == `KeyS`) {
        sPressed = true
        return
    }
    if(code == `KeyD`) {
        dPressed = true
        return
    }
    if(code == `KeyW`) {
        wPressed = true
        return
    }
})

document.addEventListener(`keyup`, function ({ code }) {
    if(code == `KeyA`) {
        aPressed = false
        return
    }
    if(code == `KeyS`) {
        sPressed = false
        return
    }
    if(code == `KeyD`) {
        dPressed = false
        return
    }
    if(code == `KeyW`) {
        wPressed = false
        return
    }
})

let pointer = 0

class Unit {
    static AIR = Symbol(`air`)
    constructor(i, j) {
        this.status = Unit.AIR
        this.i = i
        this.j = j
    }
    switchTo(status) {
        this.status = status
    }
    tossTo(unit) {
        console.log(unit);
        
        unit.switchTo(this.status)
        this.switchTo(Unit.AIR)
    }
    tick() {
        if(this.status === Unit.AIR) return
        if(this.i == 99) return
        const SIDE = Math.random() ? 1 : -1
        
        if(grid[this.i + 1][this.j].status === Unit.AIR) this.tossTo(grid[this.i + 1][this.j])
        else if(0 <= this.j + SIDE && this.j + SIDE < 150 && grid[this.i + 1][this.j + SIDE].status === Unit.AIR) this.tossTo(grid[this.i + 1][this.j + SIDE])
        else if(0 <= this.j - SIDE && this.j - SIDE < 150 && grid[this.i + 1][this.j - SIDE].status === Unit.AIR) this.tossTo(grid[this.i + 1][this.j - SIDE])
    }
}

/**
 * @type { Array<Array<Unit>> }
 */
let grid = []
for (let i = 0; i < 100; i++) {
    let line = []
    grid.push(line)
    for (let j = 0; j < 150; j++) line.push(new Unit(i, j))
}

let halfCount = 0
let colourCount = 0

function tick() {
    
    ctx.fillStyle = `#101`
    ctx.fillRect(0, 0, 3000, 2000)
    ctx.strokeStyle = `#efe`
    ctx.lineWidth = 5
    ctx.strokeRect(0, 0, 3000, 2000)
    if(aPressed) pointer--
    if(dPressed) pointer++
    if(pointer < 0) pointer = 0
    if(pointer > 149) pointer = 149
    if(sPressed) {
        grid[0][pointer].switchTo(getColourOf(colourCount))
        if(++halfCount == 2) halfCount = 0
        if(halfCount == 0) if(++colourCount == 91) colourCount = 0
    }
    const ORDER = randomOrder(150)
    for (let i = 99; i >= 0; i--) for (let j = 0; j < 150; j++) grid[i][ORDER[j]].tick()
    ctx.fillStyle = `#700`
    for (let i = 0; i < 100; i++) for (let j = 0; j < 150; j++) if(grid[i][j].status !== Unit.AIR) {
        ctx.fillStyle = `#${grid[i][j].status}`
        ctx.fillRect(j * 20, i * 20, 20, 20)
    }
    ctx.fillStyle = `#fff3`
    ctx.fillRect(pointer * 20, 0, 20, 2000)
}

setInterval(tick, 1000 / 30)