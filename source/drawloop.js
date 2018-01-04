
export class DrawLoop {

    constructor () {
        this.nextDraw = null
        this.frames = []
        this.timeouts = []
        this.frameCount = 0
        this.timeoutCount = 0
        this.timer = performance
    }

    frame (method) {
        this.frames.push({
            id: this.frameCount,
            run: method
        })
        if (this.nextDraw === null)
            this.nextDraw = requestAnimationFrame(this._draw.bind(this))
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
            this.nextDraw = requestAnimationFrame(this._draw.bind(this))
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
        let iStopTimeouts = this.timeouts.findIndex(t => t.time > now)
        if (iStopTimeouts == -1) iStopTimeouts == this.timeouts.length

        // Take out the timeouts that should run
        let runTimeouts = this.timeouts
        this.timeouts = this.timeouts.splice(iStopTimeouts)

        // Run the timeouts directly
        for (let timeout of runTimeouts)
            timeout.run()

        /**
         * Dealing with frames
         */

        if (this.frames.length) {

            // Figure out which frames should fire
            let iFirst = this.frames[0].id
            let iStopFrames = this.frameCount - iFirst + 1

            // Take out the frames that should fire
            let runFrames = this.frames
            this.frames = this.frames.splice(iStopFrames)

            // Execute the animation frames and empty this.nextDraw
            for (let frame of runFrames)
                frame.run(now)
        }

        // If we have remaining timeouts, loop until we don't
        this.nextDraw = this.timeouts.length > 0 && this.frames.length > 0
            ? requestAnimationFrame(this._draw.bind(this))
            : null
    }
}
