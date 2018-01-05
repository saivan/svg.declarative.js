
import "declarative/declarative"

let canvas = SVG.select("#canvas").first()
let target = SVG.select("#target").first()
let triangle = SVG.select("#vector").first()

// Get the matrix to move to the svg space
let pageToSvg = canvas.ctm().inverse()
let f = (x, y)=> (2 * x + y - 650) ** 2 / 10000 + (x - 200) ** 2 / 3000 + 200
let controller = SVG.controllers.spring({settleTime: 500, overshoot: 20})

canvas.mousemove(e=> {

    // Get the current mouse position and transform it into svg space
    let {x, y} = new SVG.Point(e.offsetX, e.offsetY).transform(pageToSvg)

    // Work out the vector length and rotation
    let fxy = f(x, y)
    let dfdx = (f(x + 1e-6, y) - f(x - 1e-6, y)) / 2e-6
    let dfdy = (f(x, y + 1e-6) - f(x, y - 1e-6)) / 2e-6
    let len = Math.sqrt(dfdx ** 2 + dfdy ** 2)
    let ang = 180 * Math.atan2(dfdy, dfdx) / Math.PI

    // Move the target to the required place
    target.declarative(controller)
        .scale(fxy / 200)
        .position(x, y)

    // Change the transforms
    triangle.declarative(controller)
        .around(100, 100)
        .rotate(ang)
        .position(x, y)
        .scale(2 * len, fxy / 400)
})
