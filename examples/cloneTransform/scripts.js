
import "declarative/declarative"

let canvas = SVG.select("#canvas").first()
let arrow = SVG.select("#arrow").first().opacity(0)
let arrows = []

// Get the matrix to move to the svg space
let pageToSvg = canvas.ctm().inverse()

canvas.click(e=> {

    // Get the current mouse position and transform it into svg space
    let {x, y} = new SVG.Point(e.offsetX, e.offsetY).transform(pageToSvg)

    // Kill the old arrows
    for (let clone of arrows) {
        clone.animate(200).opacity(0)
            .after(c=> clone.remove())
    }

    // Make some more arrows of different lengths and directions
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {

            // Skip the actual mouse position
            if (i==0 && j ==0) continue

            // Make the new arrow
            let newArrow = arrow.clone()
            arrows.push(newArrow)

            // Choose a position and size
            newArrow.declarative()
                .around("right")
                .rotate(Math.atan2(j, i) * 180 / Math.PI)
                .scale((i * i + j * j) ** (0.5) / 4)
                .position(x - 50 *i, y - 50 * j)
                .opacity(1)
        }
    }
})
