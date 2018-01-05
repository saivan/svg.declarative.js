
import Queue from "declarative/queue"

export class DrawLoop {

    constructor () {
        this.nextDraw = null
        this.frames = new Queue()
        this.timeouts = []
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

        // Find the first time lower than the required time
        let iSplice = this.timeouts.length
        for (; iSplice > 0; iSplice--)
            if (this.timeouts[iSplice - 1].time < time) break

        // Insert the timeout there directly
        let thisId = this.timeoutCount++
        this.timeouts.splice(iSplice, 0, {
            id: thisId,
            run: method,
            time: time,
        })
        if (this.nextDraw === null)
            this.nextDraw = requestAnimationFrame(this.drawIt)
        return thisId
    }

    cancelTimeout (id) {

        // Find the index of the timeout to cancel and remove it
        let index = this.timeouts.findIndex(t=> t.id == id)
        if (index >= 0) this.timeouts.splice(index, 1)
    }

    _draw (now) {

        /**
         * Dealing with timeouts
         */

        // Figure out the final index to run till
        let iStop = this.timeouts.findIndex(t=> t.time > now)
        if (iStop < 0) iStop = this.timeouts.length

        // Take out the timeouts that should run
        let runTimeouts = this.timeouts
        this.timeouts = this.timeouts.splice(iStop)

        // Run the timeouts directly
        for (let timeout of runTimeouts)
            timeout.run()

        /**
         * Dealing with frames
         */

        let lastId = this.frameCount
        while (this.frames.peek() && this.frames.peek().id < lastId) {
            let nextFrame = this.frames.shift()
            nextFrame.run(now)
        }

        // If we have remaining timeouts or frames, draw until we don't anymore
        this.nextDraw = this.timeouts.length > 0 || this.frames.length > 0
            ? requestAnimationFrame(this.drawIt)
            : null
    }
}
