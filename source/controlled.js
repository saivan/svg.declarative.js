
export default class Controlled {

    constructor (target=0, initial) {
        this.currentTarget = target
        this.position = initial || target
        this.error = target - initial || 0
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

        // TODO: THIS IS NOT WORKING YET
        // FIX IT

        // Get the last positions
        let [si, vi, ai] = [this.positon, this.velocity, this.acceleration]

        // Use the controller to determine what the new parameters should be
        let [ds, dv, da] = controller(
            this.error, this.velocity, this.acceleration, this.integral)
        this.position += ds * dt
        this.velocity += dv * dt
        this.acceleration += da * dt

        // Use Eulers method to update the velocity and the error
        this.position += this.velocity * dt + this.acceleration * dt * dt / 2
        this.velocity += this.acceleration * dt

        // Use the position to calculate the new error and its integral
        let newError = this.position - this.currentTarget
        this.integral += dt * (this.error +  newError) / 2 // Trapezoidal rule
        this.error = newError
    }
}
