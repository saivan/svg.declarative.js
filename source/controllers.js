
export function PID ({
    proportional=0.01,
    integral=0.00,
    derivative=0.3,
}={}) {
    let K = proportional
    let I = integral
    let D = derivative
    return function (error, velocity, acceleration, integral) {
        let control = - (K * error + I * integral + D * velocity)
        return [control, 0, 0]
    }
}

export function spring ({
    riseTime,
    settlingTime,
    overshoot=0,
}={}) {

    // Calculate the PID natural response
    let eps = 1e-10
    let os = overshoot + eps
    let zeta = - Math.log(os)
        / Math.sqrt(Math.PI ** 2 + Math.log(os) ** 2)
    let wn = 4 / (zeta * settlingTime)

    // Calculate the PID values
}


export function springy (settleTime) {
    return tunedPID({
        settleTime: settleTime,
        overshoot: 0.2,
    })
}
