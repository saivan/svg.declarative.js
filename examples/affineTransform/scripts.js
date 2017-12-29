
import {compose, decompose} from "declarative/affine"

let red = SVG.select("#red").first()
let blue = SVG.select("#blue").first()
let {cx, cy} = red.bbox()
function redMove () {

    let transform = blue.transform()
    let {
        scaleX, scaleY, theta, translateX, translateY, shear
    } = decompose(transform, cx, cy)
    console.log(`
        scaleX: ${scaleX}
        scaleY: ${scaleY}
        theta: ${theta}
        translateX: ${translateX}
        translateY: ${translateY}
        shear: ${shear})`)
    let redTransform = compose(
        translateX, translateY,
        theta,
        scaleX, scaleY,
        shear,
        cx, cy)
    red.transform(redTransform)
}

// If this function worked, the red box should cover the blue box
redMove()
