
import {compose, decompose} from "declarative/affine"
import Control from "declarative/controlled"
import {spring} from "declarative/controllers"

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
            this.convergenceThreshold = 1e-6
            this.nextTick = null
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
                // methodName (attr_fill style_width, cx, cy, ...) : {
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
                    ].map(value=> Control(value)),
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

        ,   step: function () {

                // If we are paused, just exit
                if (this.paused) return

                // Loop through all of the targets and update them based on
                // the controllers input instruction
                let convergence = 0
                let controller = this.activeController
                for (let target of this.targets) {

                    // Loop through all of the controllers and update them
                    let inputValues = []
                    for (let parameter of target.inputs) {
                        if (parameter.step) {

                            // TODO: Use the actual time instead of the fake 16
                            // Also account for the current speed
                            convergence += parameter.step(controller, 16e-3)
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
                this.speed = newSpeed
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

        ,   delay: function (time) {
                this.nextTick += time
                return this
            }

        /**
         * Methods that modify the current targets
         */

        ,   _addTarget: function (
                method, targets=[], initials=()=>[], modifier
            ) {

                let waitFor = Math.max(0, this.nextTick - (+ new Date))
                setTimeout(()=> {

                    // If the target doesn't exist, we have to check if it
                    // is possible to control and if so, assign it a controller
                    let existingTarget = this.targets.get(method)
                    if (existingTarget == undefined) {

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

                if (typeof key == 'object') {

                    // We are dealing with an object, so loop over it
                    let obj = key

                    // Iterate over the keys and values and run them
                    for (let key in obj) if (obj.hasOwnProperty(key)) {
                        this.attr(key, obj[key])
                    }

                } else {
                    let startValue = ()=> [key, this.element.attr(key)]
                    this._addTarget(`attr_${key}`, [key, value], startValue)
                }
                return this
            }

        ,   style: function (key, value) {

                if (typeof key == "object") {

                    // We are dealing with an object, so loop over it
                    let obj = key

                    // Iterate over the keys and values and run them
                    for (let key in obj) if (obj.hasOwnProperty(key)) {
                        this.attr(key, obj[key])
                    }

                } else {

                }
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
                        [relative ? x + currentX : x],
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
    })

}).call(this)
