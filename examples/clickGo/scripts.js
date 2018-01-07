
import "declarative/declarative"

let canvas = SVG.select("#canvas").first()
let target = SVG.select("#target").first()
let follower = SVG.select("#follower").first()

// Get the matrix to move to the svg space
let pageToSvg = canvas.ctm().inverse()

canvas.click(e=> {

    // Get the current mouse position and transform it into svg space
    let {x, y} = new SVG.Point(e.offsetX, e.offsetY).transform(pageToSvg)

    // Move the target to the required place
    target.center(x, y)

    // Move the follower with the declarative center
    follower.declarative()
        // .delay(200)
        .center(x, y)
})
