
function mag (a, b) {
    return Math.sqrt(a * a + b * b)
}

function unitCircle (a, b) {
    let thetaRad = Math.atan2(b, a)
    let thetaDeg = thetaRad * 180 / Math.PI
    let cos = Math.cos(thetaRad)
    let sin = Math.sin(thetaRad)
    return [thetaDeg, cos, sin]
}

export function decompose (matrix, cx, cy) {

    // Get the paramaters of the current matrix
    let {a, b, c, d, e, f} = matrix

    // Construct the parameters
    let [theta, ct, st] = unitCircle (a, b)
    let signX = Math.sign(a * ct + b * st)
    let sx = signX * mag (a, b)
    let lam = (st * d + ct * c) / (ct * a + st * b)
    let signY = Math.sign(- c * st + d * ct)
    let sy = mag (lam * a - c, d - lam * b)
    let tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy)
    let ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy)

    // Package and return the parameters
    let parameters = {
        translateX: tx,
        translateY: ty,
        theta: theta,
        scaleX: sx,
        scaleY: sy,
        shear: lam,
    }
    return parameters
}

export function compose (tx, ty, theta, sx, sy, lam, cx, cy) {

    // Calculate the trigonometric values
    let [ct, st] = [Math.cos(theta * Math.PI / 180),
                    Math.sin(theta * Math.PI / 180)]

    // Calculate the matrix components directly
    let a = sx * ct
    let b = sx * st
    let c = lam * sx * ct - sy * st
    let d = lam * sx * st + sy * ct
    let e = - sx * ct * (cx + cy * lam) + sy * st * cy + tx + cx
    let f = - sx * st * (cx + cy * lam) - sy * ct * cy + ty + cy

    // Construct a new matrix and return it
    let matrix = new SVG.Matrix([a, b, c, d, e, f])
    return matrix
}
