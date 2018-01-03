
import "declarative/declarative"

let canvas = SVG.select("#canvas").first()
let target = SVG.select("#target").first()
let follower = SVG.select("#follower").first()
let followers = [follower]
for (let i = 0; i < 3; i++) {
    followers.push(follower.clone())
}

// Get the matrix to move to the svg space
let pageToSvg = canvas.ctm().inverse()
let f = (v, p)=> 80 * Math.sin(v / 100 + p * Math.PI) + 150
let r = (m, M)=> (M - m) * Math.random() + m

canvas.mousemove(e=> {

    // Get the current mouse position and transform it into svg space
    let {x, y} = new SVG.Point(e.offsetX, e.offsetY).transform(pageToSvg)

    // Move the target to the required place
    target.center(x, y)

    // Move the follower with the declarative center
    for (follower of followers) {
        let p = r(-0.4, 0.4)
        follower.declarative()
            .speed(1.5)
            .delay(200)
            .center(x + r(-50, 50), y + r(-50, 50))
            .attr("fill-opacity", 0.3 * Math.sin((x + y) / 100) + 0.7)
            .delay(1000)
            .style("stroke-width", (x + y) / 200)
            .attr({
                "fill": [f(x + y, p), f(x + y, p + 2/3), f(x + y, p + 4/3)],
                "stroke": `#FABE58`,
            })
        }
})

target.click(e=> {
    let paused = follower.declarative().paused
    for (follower of followers)
        follower.declarative().pause(!paused)
})
