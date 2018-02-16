
import {compose, decompose} from "declarative/affine"


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

    snap () {
        // Does nothing.
    }
}


class NumberC {

    constructor (target, min, max) {
        this.reset(target)
        this.min = min
        this.max = max
    }

    reset (newValue) {
        this.currentTarget = Number(newValue)
        this.position = Number(newValue)
        this.error = 0
        this.velocity = 0
        this.acceleration = 0
        this.integral = 0
    }

    target (newTarget) {
        if (isFinite(newTarget)) {
            this.currentTarget = Number(newTarget)
            this.error = this.position - this.currentTarget
        }
        return this.currentTarget
    }

    value () {
        let value = value < this.min ? this.min
            : value > this.max ? this.max
            : this.position
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

    snap () {
        this.postion = this.currentTarget
        this.velocity = 0
        this.acceleration = 0
        this.integral = 0
        this.error = 0
    }
}

class CircularC extends NumberC {

    constructor (target, min, max) {
        super(target, min, max)
        this.range = max - min
        this.getError = CircularC.circularDifference(min, max)
    }

    target (newTarget) {
        if (isFinite(newTarget)) {
            this.currentTarget = Number(newTarget)
            this.error = this.getError(this.currentTarget, this.position)
        }
        return this.currentTarget
    }

    step (controller, dt) {

        this.position = this.min + CircularC.mod(this.position, this.range)
        this.error = this.getError(this.position - this.min, this.currentTarget)
        let convergence = super.step(controller, dt)
        return convergence
    }

    static circularDifference(min, max) {

        // Form the circular difference function
        let diff = max - min
        function circular (target, angle) {
            return CircularC.mod(target - angle + diff / 2, diff) - diff / 2
        }
        return circular
    }

    // Define a modulo function since javascript doesn't behave properly
    static mod (a, n) {
        return a - n * Math.floor(a / n)
    }
}


class MatrixC {

    constructor (matrix= new SVG.Matrix(), cx= 0, cy= 0) {

        // Store all of the parameters
        this.currentMatrix = matrix
        this.thetaController = new CircularC(0, 0, 360)
        this.controllers = [
            new NumberC(matrix.a), new NumberC(matrix.b),
            new NumberC(matrix.c), new NumberC(matrix.d),
            new NumberC(matrix.e), new NumberC(matrix.f)
        ]

        // If we want an affine transformation, we find the parameters
        this.cx = cx
        this.cy = cy
        this.useAffine = false // If true, it will be set below
    }

    center (cx, cy) {
        this.cx = cx
        this.cy = cy
        return this
    }

    affine (useAffine=true) {

        // Work out if we need to modify the targets
        let toggled = Boolean(this.useAffine ^ useAffine)
        this.useAffine = useAffine

        // Convert the targets to affine or vice versa
        if (toggled) this.target(this.currentMatrix, true)
        return this
    }

    target (matrix, reset=false) {

        // Extract the parameters
        let v = null
        if (this.useAffine) {

            // Decompose the matrix into its parameters
            let {
                translateX, translateY, theta, scaleX, scaleY, shear
            } = decompose(matrix, this.cx, this.cy)
            v = [translateX, translateY, theta, scaleX, scaleY, shear]

            // Set the angular controller correctly
            this.thetaController[reset ? "reset" : "target"](theta)

        } else {
            v = [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f]
        }

        // Set the new target for each controller
        this.controllers.forEach((c, i)=> c[reset ? "reset" : "target"](v[i]))
    }

    value () {
        return this.currentMatrix
    }

    step (controller, dt) {

        // Step through all of the numbers, updating them
        let convergence = 0
        for (let number of this.controllers) {
            convergence += number.step(controller, dt)
        }

        // Extract the current matrix from this
        if (this.useAffine) {

            // Get the affine parameters and add on the center point
            let parameters = this.controllers
                .map(c=> c.value())
                .concat([this.cx, this.cy])

            // Replace the theta value for the one from the theta controller
            convergence += this.thetaController.step(controller, dt)
            parameters[2] = this.thetaController.value()

            // Compose the affine parameters into a matrix
            this.currentMatrix = compose(...parameters)

        } else {

            // If we are not using affine transforms, just return directly
            let values = this.controllers.map(c=> c.value())
            this.currentMatrix = new SVG.Matrix(values)
        }

        // Return the convergence error
        return convergence
    }

    snap () {

        // Snap the main controllers
        for (let controller of this.controllers) {
            controller.snap()
        }

        // Snap the theta controller
        this.thetaController.snap()
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


// TODO: Allow svg d elements to animate by picking out their numbers and
// replacing them all
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

    snap () {
        for (let controller of this.targets)
            controller.snap()
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
    if (value instanceof SVG.Matrix)
        return new MatrixC(...arguments)
    else if (ColorC.matches(value))
        return new ColorC(...arguments)
    else if (isFinite(value))
        return new NumberC(...arguments)
    else return new ConstantC(...arguments)
}
