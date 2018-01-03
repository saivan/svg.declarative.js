
import {compose, decompose} from "declarative/affine"
import Control from "declarative/controlled"
import {spring} from "declarative/controllers"

(function () {

    SVG.declarative = SVG.invent({

        parent: SVG.Element

    ,   create: function (element) {

            // Store the element
            this.element = element

            // The controller is in charge of moving our object towards its
            // desired state directly.
            this.activeController = null
            this.nextFrame = null
            this.convergence = null
            this.convergenceThreshold = 1e-6
            this.canInterrupt = true
            this.nextTick = null
            this.playSpeed = 1
            this.paused = false

            // Keep track of the state that we want our object to be in
            this.useAffine = true
            let {cx, cy} = element.bbox()
            this.transformTarget = element.transform().matrix
            this.proposedTransforms = {}
            this._resetTransformProposal()
            this.targets = [

                // A target should have the following format. Note that
                // modifiers are functions that take the inputs and return them
                // in a format suitable for the method
                //
                // {
                //      methodName (attr_fill style_width, cx, cy, ...)
                //      timeout: id
                //      modifier: function
                //      inputs: [
                //          any class from controlled
                //      ]
                // }
                { // Transformations
                    method: "transform",
                    timeout: null,
                    inputs: [
                        Control(this.transformTarget, cx, cy)
                            .affine(this.useAffine)
                    ],
                },
            ]
            this.targets.get = function (method) {
                let found = this.find(item=> item.method == method)
                return found
            }

            // Set the transformation origin for absolute transforms
            this.toOrigin = null
            this.fromOrigin = null
            this.transformOrigin = null
            this.around(cx, cy)
        }

    ,   construct: {

        declarative: function (controller) {

            if (this.chaser) {

                if (controller)
                    this.chaser.controller(newController)

            } else {
                this.chaser = new SVG
                    .declarative(this)
                    .controller(controller)
            }

            // Set the time for the next tick
            this.chaser.nextTick = +new Date
            return this.chaser
        }
    }

    ,   extend: {

        /**
         * Methods that directly modify the simulation
         */

            pause: function (state=true) {
                this.paused = state
                if (this.paused == false)
                    this.step()
                return this
            }

        ,   continue: function () {
                if (this.paused) return
                if (!this.nextFrame)
                    this.step()
                return this
            }

        ,   overwrite: function (should=true) {
                this.canInterrupt = should
                return this
            }

        ,   step: function (time) {

                // If we are paused, just exit
                if (this.paused) return

                // Get the time delta
                let dt = this.playSpeed * (time - this.lastTime || 16) / 1000
                this.lastTime = time

                // Loop through all of the targets and update them based on
                // the controllers input instruction
                let convergence = 0
                let controller = this.activeController
                for (let target of this.targets) {

                    // Loop through all of the controllers and update them
                    let inputValues = []
                    for (let parameter of target.inputs) {
                        convergence += parameter.step(controller, dt)
                        let newValue = parameter.value()
                        inputValues.push(newValue)
                    }

                    // Call the modifier to get the parameters in the right
                    // format for the method
                    let modified = inputValues
                    if (target.modifier) {
                        modified = target.modifier(inputValues)
                    }

                    // Call the correct method on the target object
                    let methodName = target.method.split("_")[0]
                    this.element[methodName](...modified)
                }

                // Get the next animation frame to keep the simulation going
                if (convergence > this.convergenceThreshold)
                    this.nextFrame = requestAnimationFrame(this.step.bind(this))
                else this.nextFrame = null
                return this
            }

        ,   speed: function (newSpeed) {
                this.playSpeed = newSpeed
                return this
            }

        ,   controller: function (newController= spring()) {
                this.activeController = newController
                return this
            }

        ,   affine: function (useAffine=true) {

                // If useAffine is true, transformations will occur in an
                // affine manner, otherwise, we will directly morph abcdef
                this.useAffine = useAffine
                let [matrixC] = this.targets.get("transform").inputs
                matrixC.affine(useAffine)
                return this
            }

        ,   around: function (ox, oy) {

            // Sets the transformation origin explicitly, by default, the
            // transform origin is around the center of the bbox
            this.transformOrigin = [ox, oy]
            this.fromOrigin = new SVG.Matrix([1, 0, 0, 1, ox, oy])
            this.toOrigin = this.fromOrigin.inverse()

            // Also change the origin for the matrix controller
            let [matrixC] = this.targets.get("transform").inputs
            matrixC.center(ox, oy)
            return this
        }

        ,   threshold: function (newThreshold) {
                this.threshold = newThreshold
                return this
            }

        ,   delay: function (time) {
                this.nextTick += time / this.playSpeed
                return this
            }

        /**
         * Methods that modify the current targets
         */

        ,   _addTarget: function (
                method, targets=[], initials=()=>[], modifier
            ) {

                // Work out when to continue
                let waitFor = Math.max(0, this.nextTick - (+ new Date))
                let existingTarget = this.targets.get(method)

                // If the target already exists, delete its timeout
                if (existingTarget) {
                    if (!this.canInterrupt)
                        clearTimeout(existingTarget.timeout)

                // If the target doesn't exist, we have to check if it
                // is possible to control and if so, assign it a controller
                } else {

                    // Loop through all of the inputs, and if they are
                    // numeric then we have to make them into controllers
                    let argumentsControlled = []
                    let init = initials()
                    for (let i = 0 ; i < targets.length ; i++) {
                        let start = init[i] === undefined
                            ? targets[i]
                            : init[i]
                        let controlled = Control(start)
                        argumentsControlled.push(controlled)
                    }

                    // Construct the target for this method
                    existingTarget = {
                        method: method,
                        inputs: argumentsControlled,
                        modifier: modifier,
                    }
                    this.targets.push (existingTarget)
                }

                // Wait for the correct time then change the targets
                existingTarget.timeout = setTimeout(()=> {

                    // Set the new targets provided directly
                    for (let i = 0 ; i < targets.length; i++) {
                        let methodArgument = existingTarget.inputs[i]
                        let newTarget = targets[i]
                        methodArgument.target(newTarget)
                    }

                    // Continue the animation in case it stopped
                    this.continue()

                }, waitFor)
            }

        ,   _bakeTransforms: function () {

                // Calculate the net matrix
                let {
                    translation, rotation, scale, flip, skew
                } = this.proposedTransforms
                this.transformTarget = translation
                    .multiply(this.fromOrigin)
                    .multiply(rotation)
                    .multiply(scale)
                    .multiply(flip)
                    .multiply(skew)
                    .multiply(this.toOrigin)

                // Add the target for the new transform
                this._addTarget("transform", [this.transformTarget])
            }

        ,   _resetTransformProposal: function () {

                this.proposedTransforms = {
                    translation: new SVG.Matrix(),
                    rotation: new SVG.Matrix(),
                    scale: new SVG.Matrix(),
                    flip: new SVG.Matrix(),
                    skew: new SVG.Matrix(),
                }
            }

        ,   _attrStyle: function (key, value, type) {

                if (typeof key == 'object') {

                    // We are dealing with an object, so loop over it
                    let obj = key

                    // Iterate over the keys and values and run them
                    for (let key in obj) if (obj.hasOwnProperty(key)) {
                        this[type](key, obj[key])
                    }

                } else {
                    let startValue = ()=> [key, this.element[type](key)]
                    this._addTarget(`${type}_${key}`, [key, value], startValue)
                }
            }

        // Properties

        ,   attr: function (key, value) {
                this._attrStyle(key, value, "attr")
                return this
            }

        ,   style: function (key, value) {
                this._attrStyle(key, value, "style")
                return this
            }

        // Basic movements

        ,   x: function (x, relative) {

                if (this.element instanceof SVG.G) {

                    // TODO: Deal with groups by using a transform

                } else {

                    // Get the current position for this object
                    let control = this.targets.get("x")
                    let currentX = ()=> control
                        ? control.inputs[0].target()
                        : this.element.x()

                    // Add an x target directly
                    this._addTarget("x",
                        [relative ? x + currentX() : x],
                        currentX)
                }
                return this
            }

        ,   y: function (y, relative) {

                if (this.element instanceof SVG.G) {

                    // TODO: Deal with groups by using a transform

                } else {

                    // Get the current position for this object
                    let control = this.targets.get("y")
                    let currentY = ()=> control
                        ? control.inputs[0].target()
                        : this.element.x()

                    // Add a y target directly
                    this._addTarget("y",
                        [relative ? y + currentY : y],
                        currentY)
                }
                return this
            }

        ,   move: function (x, y, relative) {
                this.x(x, relative).y(y, relative)
                return this
            }

        ,   cx: function (x, relative) {

                // Get the bounding boxes width to subtract off of the x
                let oX = this.element.bbox().width / 2
                this.x(x - oX, relative)
                return this
            }

        ,   cy: function (y, relative) {

                // Get the bounding boxes width to subtract off of the x
                let oY = this.element.bbox().height / 2
                this.y(y - oY, relative)
                return this
            }

        ,   center: function (x, y, relative) {
                this.cx(x, relative).cy(y, relative)
                return this
            }

        // Transformations

        ,   matrix: function (matrix, relative=false) {

                this._resetTransformProposal()
                this.transformTarget = relative
                    ? this.transformTarget.multiply(matrix)
                    : matrix
                this._addTarget("transform", [this.transformTarget])
                return this
            }

        ,   rotate: function (theta, relative=false) {

                // Calculate the rotation matrix
                let thetaRad = Math.PI * theta / 180
                let [c, s] = [Math.cos(thetaRad), Math.sin(thetaRad)]
                let rotation = new SVG.Matrix([c, s, -s, c, 0 , 0])

                // We set the proposed transform and bake it if necessary,
                // otherwise, we just apply it as a relative matrix
                this.proposedTransforms.rotation = rotation
                if (relative) this.matrix(rotation, relative)
                else this._bakeTransforms()
                return this
            }

        ,   translate: function (x, y, relative=false) {

                // Construct the matrix
                let translation = new SVG.Matrix([1, 0, 0, 1, x, y])

                // We set the proposed transform and bake it if necessary,
                // otherwise, we just apply it as a relative matrix
                this.proposedTransforms.translation = translation
                if (relative) this.matrix(translation, relative)
                else this._bakeTransforms()
                return this
            }

        ,   position: function (x, y) {

                // Forcibly place the center at the x, y position given
                let [cx, cy] = this.transformOrigin
                this.translate(x - cx, y - cy, false)
                return this
            }

        ,   scale: function (sx, sy, relative=false) {

                // The user can provide only one scale for a proportional scale
                if (!isFinite(sy)) {
                    relative = sy || relative
                    sy = sx
                }

                // Build the scale matrix
                let scale = new SVG.Matrix([sx, 0, 0, sy, 0, 0])

                // We set the proposed transform and bake it if necessary,
                // otherwise, we just apply it as a relative matrix
                this.proposedTransforms.scale = scale
                if (relative) this.matrix(scale, relative)
                else this._bakeTransforms()
                return this
            }

        ,   flip: function (direction="x", relative=false) {

                // Build the flip matrix
                if (relative) {
                    let flip = new SVG.Matrix()
                    flip[direction == "x" ? "a" : "d"] = -1
                    this.matrix(scale, relative)

                } else {

                    // Flip the respective entry in the flip matrix
                    this.proposedTransforms
                        .flip[direction == "x" ? "a" : "d"] *= -1
                    this._bakeTransforms()
                }
                return this
            }

        ,   skew: function (lamX, lamY, relative=false) {

                // The user can provide only one skew for a proportional skew
                if (!isFinite(sy)) {
                    relative = lamY || relative
                    lamY = lamX
                }

                // Calculate the skew matrix
                let skew = new SVG.Matrix([1, lamY, lamX, 1, 0, 0])

                // Modify the current matrix
                this.proposedTransforms.skew = skew
                if (relative) this.matrix(skew, relative)
                else this._bakeTransforms()
                return this
            }

        // Syntax Sugar

        ,   fill: function (item) {
                // If we have an object, set the individual attributes
            }

        ,   stroke: function (item) {
                // If we have an object, set the individual attributes
            }

        ,   size: function (sx, sy) {

            }

        ,   width: function (item) {

            }

        ,   height: function (item) {

            }
        }
    })

}).call(this)
