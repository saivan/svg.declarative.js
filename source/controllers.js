
export function spring ({
    settleTime=500,
    overshoot=15,
}={}) {

    // Calculate the PID natural response
    let eps = 1e-10
    let os = overshoot / 100 + eps
    let zeta = - Math.log(os) / Math.sqrt(Math.PI ** 2 + Math.log(os) ** 2)
    let wn = 4 / (zeta * settleTime / 1000)

    // Calculate the Spring values
    let D = 2 * zeta * wn
    let K = wn * wn

    // Return the acceleration required
    return function (error, velocity, acceleration, integral) {
        let control = - D * velocity - K * error
        return [,, control]
    }
}
