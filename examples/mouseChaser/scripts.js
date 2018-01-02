
import "declarative/declarative"

let canvas = SVG.select("#canvas").first()
let target = SVG.select("#target").first()
let follower = SVG.select("#follower").first()

// Get the matrix to move to the svg space
let pageToSvg = canvas.ctm().inverse()
let color = (v, p)=> 80 * Math.sin(v / 100 + p * Math.PI) + 150

canvas.mousemove(e=> {

    // Get the current mouse position and transform it into svg space
    let {x, y} = new SVG.Point(e.offsetX, e.offsetY).transform(pageToSvg)

    // Move the target to the required place
    target.center(x, y)

    // Move the follower with the declarative center
    follower.declarative()
        .delay(200)
        .center(x, y)
        .attr("fill-opacity", 0.3 * Math.sin((x + y) / 100) + 0.7)
        .delay(1000)
        .attr("fill", [color(x + y, 0), color(x + y, 2/3), color(x + y, 4/3)])
})

target.click(e=> {
    let paused = follower.declarative().paused
    follower.declarative().pause(!paused)
})
