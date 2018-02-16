
import "declarative/declarative"

let canvas = SVG.select("#canvas").first()
let target = SVG.select("#target").first()
let triangle = SVG.select("#vector").first()
let vecTarget = SVG.select("#vectorTarget").first()

// Get the matrix to move to the svg space
let f = (x, y)=> 0.2 * (Math.sin(x / 10) * Math.cos(y / 10) + 0.5)
let controller = SVG.controllers.spring({settleTime: 800, overShoot: 10})
let t = 0

setInterval(()=> {

    // Get the current mouse position and transform it into svg space
    // let {x, y} = canvas.point(e.pageX, e.pageY)
    let [x, y] = [ 500 + 300 * Math.cos(t), 500 + 300 * Math.sin(t)]
    t += 0.002

    // Work out the vector length and rotation
    let fxy = f(x, y)
    let dfdx = (f(x + 1e-6, y) - f(x - 1e-6, y)) / 2e-6
    let dfdy = (f(x, y + 1e-6) - f(x, y - 1e-6)) / 2e-6
    let len = Math.sqrt(dfdx ** 2 + dfdy ** 2)
    let ang = 180 * Math.atan2(dfdy, dfdx) / Math.PI

    // Move the target to the required place
    target.declarative(controller)
        .scale(1 + fxy)
        .position(x, y)

    // Change the transforms
    triangle.declarative(controller)
        .around(100, 100)
        .rotate(ang)
        .position(x, y)
        .scale(100 * len, 1 + fxy)

    vecTarget.untransform()
        .translate(x, y)
        .rotate(ang, 0, 0)
        .scale(100 * len, 1 + fxy, 0, 0)

}, 16)

canvas.click(()=> {
    triangle.declarative().snap()
})
