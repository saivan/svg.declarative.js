
class ConstantC {
    constructor (value) {
        this.target(value)
    }

    target (value) {
        this.constant = value
    }

    value () {
        return this.constant
    }

    step (controller, dt) {
        return 0
    }
}


class NumberC {

    constructor (target) {
        this.currentTarget = target
        this.position = target
        this.error = target
        this.velocity = 0
        this.acceleration = 0
        this.integral = 0
    }

    target (newTarget) {
        if (isFinite(newTarget)) {
            this.currentTarget = newTarget
            this.error = this.position - this.currentTarget
        }
        return this.currentTarget
    }

    value () {
        return this.position
    }

    step (controller, dt) {

        // Use the controller to determine what the new parameters should be
        let [sNew, vNew, aNew] = controller(
            this.error, this.velocity, this.acceleration, this.integral)
        this.position = isFinite(sNew) ? sNew : this.position
        this.velocity = isFinite(vNew) ? vNew : this.velocity
        this.acceleration = isFinite(aNew) ? aNew : this.acceleration

        // Use Eulers method to update the velocity and the error
        this.position += this.velocity * dt + this.acceleration * dt * dt / 2
        this.velocity += this.acceleration * dt

        // Use the position to calculate the new error and its integral
        let newError = this.position - this.currentTarget
        this.integral += dt * (this.error +  newError) / 2 // Trapezoidal rule
        this.error = newError

        // If the controller isn't doing anything, we consider it converged
        let convergence = Math.abs((sNew || 0) + (vNew || 0) + (aNew || 0))
        return convergence
    }
}


class MatrixC {
    constructor (string) {
    }

    target (colorString) {
    }

    value () {
    }

    step (controller, dt) {
    }

    static matches (item) {
    }
}


class ArrayC {

    constructor (string) {
    }

    target (colorString) {
    }

    value () {
    }

    step (controller, dt) {
    }

    static matches (item) {
    }
}


let numbers = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/i
class StringC {

    construct (string) {

        //
        this.values = []
        this.template = string.replace(numbers, match=> {

            // Parse the match as a number
            let value = window.Number(match)
            let controller = new Number()
            return "__v__"
        })
    }

    target (colorString) {
    }

    value () {
    }

    step (controller, dt) {
    }

    static matches (item) {
    }
}


class ColorC {

    constructor (string) {
        this.targets = [new NumberC (0), new NumberC (0), new NumberC (0)]
        this.target(string)
    }

    target (color) {

        // Get the new values from the color
        let values = null
        if (color instanceof Array) {
            values = color.map(v=> parseInt(v))

        } else if (typeof color == "string") {

            let hexMatch = color.match(SVG.regex.hex)
            let rgbMatch = color.match(SVG.regex.rgb)
            values = hexMatch
                ? hexMatch.splice(1).map(v=> parseInt(v, 16))
                : rgbMatch.splice(1).map(v=> parseInt(v))

        } else return

        // Set the new targets
        this.targets.forEach((target, i)=> target.target(values[i]))

        // Return the values for use
        return values
    }

    value () {

        // Get the numbers and bound them to an int between [0, 255]
        let values = this.targets.map(v=> {
            let value = Math.floor(v.value())
            value = value < 0 ? 0
                : value > 255 ? 255
                : value
            return value
        })
        let valueString = values.join(", ")
        let rgbString = `rgb(${valueString})`
        return rgbString
    }

    step (controller, dt) {
        let convergence = 0
        for (let target of this.targets)
            convergence += target.step(controller, dt)
        return convergence
    }

    static matches (item) {
        if (typeof item !== "string") return false
        let isHex = SVG.regex.isHex.test(item)
        let isRgb = SVG.regex.isRgb.test(item)
        return isRgb || isHex
    }
}


export default function Control (value) {

    // If we have any of the correct types, then we should control them
    if (ColorC.matches(value))
        return new ColorC(value)
    else if (isFinite(value))
        return new NumberC(value)
    else return new ConstantC(value)
}
