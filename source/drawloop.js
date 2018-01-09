
import Queue from "declarative/queue"

export class DrawLoop {

    constructor () {
        this.nextDraw = null
        this.frames = new Queue()
        this.timeouts = new Queue()
        this.frameCount = 0
        this.timeoutCount = 0
        this.timer = performance
        this.drawIt = this._draw.bind(this)
    }

    frame (method) {
        this.frames.push({
            id: this.frameCount,
            run: method
        })
        if (this.nextDraw === null)
            this.nextDraw = requestAnimationFrame(this.drawIt)
        return this.frameCount++
    }

    timeout (method, delay=0) {

        // Work out when the event should fire
        let time = this.timer.now() + delay

        // Add the timeout to the end of the queue
        let thisId = this.timeoutCount++
        this.timeouts.push({
            id: thisId,
            run: method,
            time: time,
        })

        // Request another animation frame if we need one
        if (this.nextDraw === null)
            this.nextDraw = requestAnimationFrame(this.drawIt)
        return thisId
    }

    cancelTimeout (id) {

        // Find the index of the timeout to cancel and remove it
        let index = this.timeouts.remove(t=> t.id == id)
    }

    _draw (now) {

        // Run all the timeouts we can run, if they are not ready yet, add them
        // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
        let tracking = true, nextTimeout = null
        let lastTimeoutId = (this.timeouts.peekLast() &&
            this.timeouts.peekLast().id)
        while (tracking && (nextTimeout = this.timeouts.shift())) {

            // If we hit the last item, we should stop shifting out more items
            if (nextTimeout.id == lastTimeoutId) tracking = false

            // Run the timeout if its time, or push it to the end
            if (now > nextTimeout.time) nextTimeout.run()
            else this.timeouts.push(nextTimeout)
        }

        // Run all of the frames available up until this point
        let lastFrameId = this.frameCount
        while (this.frames.peek() && this.frames.peek().id < lastFrameId) {
            let nextFrame = this.frames.shift()
            nextFrame.run(now)
        }

        // If we have remaining timeouts or frames, draw until we don't anymore
        this.nextDraw = this.timeouts.length > 0 || this.frames.length > 0
            ? requestAnimationFrame(this.drawIt)
            : null
    }
}
