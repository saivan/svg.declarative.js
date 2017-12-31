
import {compose, decompose} from "declarative/affine"
import Controlled from "declarative/controlled"
import {PID} from "declarative/controllers"

(function () {

    let identity = new SVG.Matrix()

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
            this.convergenceThreshold = null
            this.paused = false

            // Keep track of the state that we want our object to be in
            let {cx, cy} = element.bbox()
            this.transformOrigin = [cx, cy]
            this.useAffine = true
            this.transformTarget = element.transform().matrix
            this.proposedTransforms = this._resetProposedTransforms()
            this.targets = [

                // A target should have the format
                //
                // methodName (attr, style, cx, cy, ...) : {
                //      inputs: [
                //          Controlled OR value
                //      ]
                //      modifier: function
                // }
                //
                // Controlled arguments should be controlled, whereas
                // uncontrolled arguments are passed directly. The modifier
                // is in charge of modifying the internal representation
                // before it is passed to the corresponding method for action.

                { // Transformations
                    method: "transform",
                    inputs: [
                        0, // TranslateX or a
                        0, // TranslateY or b
                        0, // theta or c
                        1, // scaleX or d
                        1, // scaleY or e
                        0, // shear or f
                    ].map(value=> new Controlled(value)),
                    modifier: currentInputs=> {
                        if (this.useAffine) {
                            let affineParameters
                                = currentInputs.concat(this.transformOrigin)
                            let matrix = compose(...affineParameters)
                            return matrix
                        } else {
                            let matrix = new SVG.Matrix(currentInputs)
                            return matrix
                        }
                    }
                },
            ]
            this.targets.get = function (method) {
                let found = this.find(item=> item.method == method)
                return found
            }
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
            }

        ,   step: function () {

                // If we are paused, just exit
                if (this.paused) return

                // Loop through all of the targets and update them based on
                // the controllers input instruction
                for (let target of this.targets) {

                    // Loop through all of the controllers and update them
                    let inputValues = []
                    for (let parameter of target.inputs) {
                        if (parameter instanceof Controlled) {

                            // TODO: Use the actual time instead of the fake 16...
                            parameter.step(this.activeController, 16)
                            let newValue = parameter.value()
                            inputValues.push(newValue)

                        } else {
                            inputValues.push(parameter)
                        }
                    }

                    // Call the modifier to get the parameters in the right
                    // format for the method
                    let modified = inputValues
                    if (target.modifier) {
                        modified = target.modifier(inputValues)
                    }

                    // Call the correct method on the target object
                    this.element[target.method](...modified)
                }

                // Get the next animation frame to keep the simulation going
                // TODO: Detect when we have converged and stop! We converge
                // when our error, velocity and acceleration is close to zero
                // for all of our targets. Have a maxError variable that
                // needs to be below a threshold.
                this.nextFrame = requestAnimationFrame(this.step.bind(this))
                return this
            }

        ,   speed: function (newSpeed) {
                this.speed = newSpeed
                return this
            }

        ,   controller: function (newController= PID()) {
                this.activeController = newController
                return this
            }

        ,   affine: function (useAffine=true) {
                // If useAffine is true, transformations will occur in an
                // affine manner, otherwise, we will directly morph abcdef
                this.useAffine = useAffine

                // TODO: Convert the targets back and forth
                return this
            }

        ,   around: function (ox, oy) {

            // Sets the transformation origin explicitly, by default, the
            // transform origin is around the center of the bbox
            this.transformOrigin = [ox, oy]
            return this
        }

        ,   threshold: function (newThreshold) {
                this.threshold = newThreshold
                return this
            }

        /**
         * Methods that modify the current targets
         */

        ,   _addTarget: function (
                method, targets=[], initials=[], modifier
            ) {
                // If the target already exists, we just update the targets
                // for every input provided (the formats have to match)
                let existingTarget = this.targets.get(method)
                if (existingTarget) {

                    for (let i = 0 ; i < targets.length; i++) {

                        // Get the particular to argument to retarget
                        let methodArgument = existingTarget.inputs[i]

                        // If the argument is controlled, give it a new target
                        if (methodArgument instanceof Controlled) {
                            let newTarget = targets[i]
                            methodArgument.target(newTarget)

                        // Otherwise, just use the value provided directly
                        } else {
                            methodArgument.target = targets[i]
                        }
                    }

                // If it doesn't exist, we have to check if the input is
                // possible to control and if so, assign it a controller
                } else {

                    // Loop through all of the inputs, and if they are numeric
                    // then we have to make them into controllers
                    let argumentsControlled = []
                    for (let i = 0 ; i < targets.length ; i++) {

                        // Get the current target and start value
                        let [target, initial] = [targets[i], initials[i]]

                        // TODO: Allow for colors and arrays
                        if (isFinite(targets[i])) {
                            let controlled = new Controlled(target, initial)
                            argumentsControlled.push(controlled)
                        } else {
                            argumentsControlled.push(target)
                        }
                    }

                    // Construct the target for this method
                    this.targets.push ({
                        method: method,
                        inputs: argumentsControlled,
                        modifier: modifier,
                    })
                }

                // Continue the animation in case it stopped
                this.continue()
            }

        ,   _addTransform: function (transform, relative) {

                // Work out the new matrix
                if (relative) {

                    // If its a relative transform, we just modify the last
                    // matrix and reset the proposed transforms immediately

                } else {

                    // Apply the proposed transforms by multiplying them in
                    // the correct order and replacing the target

                }

                // Update the transform targets
            }

        ,   _resetProposedTransforms: function () {
                this.proposedTransforms = {
                    translate: identity,
                    rotate: identity,
                    scale: identity,
                    skew: identity,
                }
                return this.proposedTransforms
            }

        // Properties
        ,   attr: function (key, value) {

            }

        ,   style: function (key, value) {

            }

        // Basic movements
        ,   x: function (x, relative) {

                if (this.element instanceof SVG.G) {

                    // TODO: Deal with groups by using a transform

                } else {

                    // Get the current position for this object
                    let control = this.targets.get("x")
                    let currentX = control
                        ? control.inputs[0].target()
                        : this.element.x()

                    // Add an x target directly
                    this._addTarget("x",
                        [relative ? x + currentX : x],
                        [currentX])
                }
                return this
            }

        ,   y: function (y, relative) {

                if (this.element instanceof SVG.G) {

                    // TODO: Deal with groups by using a transform

                } else {

                    // Get the current position for this object
                    let control = this.targets.get("y")
                    let currentY = control
                        ? control.inputs[0].target()
                        : this.element.x()

                    // Add a y target directly
                    this._addTarget("y",
                        [relative ? y + currentY : y],
                        [currentY])
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

        ,   matrix: function (matrix, relative) {

            }

        ,   rotate: function (theta, relative) {

            }

        ,   translate: function (x, y, relative) {

            }

        ,   scale: function (sx, sy, relative) {

            }

        ,   skew: function (lamX, lamY, relative) {

            }

        ,   flip: function (direction="x", relative) {

            }
        }
    })

}).call(this)
