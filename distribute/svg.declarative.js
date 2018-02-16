/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.decompose = decompose;
exports.compose = compose;

function mag(a, b) {
    return Math.sqrt(a * a + b * b);
}

function unitCircle(a, b) {
    var thetaRad = Math.atan2(b, a);
    var thetaDeg = thetaRad * 180 / Math.PI;
    var cos = Math.cos(thetaRad);
    var sin = Math.sin(thetaRad);
    return [thetaDeg, cos, sin];
}

function decompose(matrix, cx, cy) {

    // Get the paramaters of the current matrix
    var a = matrix.a,
        b = matrix.b,
        c = matrix.c,
        d = matrix.d,
        e = matrix.e,
        f = matrix.f;

    // Construct the parameters

    var _unitCircle = unitCircle(a, b),
        _unitCircle2 = _slicedToArray(_unitCircle, 3),
        theta = _unitCircle2[0],
        ct = _unitCircle2[1],
        st = _unitCircle2[2];

    var signX = Math.sign(a * ct + b * st);
    var sx = signX * mag(a, b);
    var lam = (st * d + ct * c) / (ct * a + st * b);
    var signY = Math.sign(-c * st + d * ct);
    var sy = mag(lam * a - c, d - lam * b);
    var tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy);
    var ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy);

    // Package and return the parameters
    var parameters = {
        translateX: tx,
        translateY: ty,
        theta: theta,
        scaleX: sx,
        scaleY: sy,
        shear: lam
    };
    return parameters;
}

function compose(tx, ty, theta, sx, sy, lam, cx, cy) {

    // Calculate the trigonometric values
    var _ref = [Math.cos(theta * Math.PI / 180), Math.sin(theta * Math.PI / 180)],
        ct = _ref[0],
        st = _ref[1];

    // Calculate the matrix components directly

    var a = sx * ct;
    var b = sx * st;
    var c = lam * sx * ct - sy * st;
    var d = lam * sx * st + sy * ct;
    var e = -sx * ct * (cx + cy * lam) + sy * st * cy + tx + cx;
    var f = -sx * st * (cx + cy * lam) - sy * ct * cy + ty + cy;

    // Construct a new matrix and return it
    var matrix = new SVG.Matrix([a, b, c, d, e, f]);
    return matrix;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _affine = __webpack_require__(0);

var _controlled = __webpack_require__(2);

var _controlled2 = _interopRequireDefault(_controlled);

var _controllers = __webpack_require__(3);

var _drawloop = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var timer = performance;
var draw = new _drawloop.DrawLoop();

SVG.declarative = SVG.invent({

    parent: SVG.Element,

    create: function create(element) {

        // Store the element
        this.element = element;

        // The controller is in charge of moving our object towards its
        // desired state directly.
        this.convergenceThreshold = 1e-6;
        this.activeController = null;
        this.useLast = false;
        this.nextFrame = null;
        this.targetTime = null;
        this.playSpeed = 1;
        this.paused = false;

        // Keep track of the state that we want our object to be in
        this.useAffine = true;

        var _element$bbox = element.bbox(),
            cx = _element$bbox.cx,
            cy = _element$bbox.cy;

        this.transformTarget = element.transform().matrix;
        this.proposedTransforms = {};
        this._resetTransformProposal();
        this.targets = [

        // A target should have the following format. Note that
        // modifiers are functions that take the inputs and return them
        // in a format suitable for the method
        //
        // {
        //      methodName (attr_fill, style_width, cx, cy, ...)
        //      modifier: function
        //      inputs: [
        //          any class from controlled
        //      ]
        // }
        { // Transformations
            method: "transform",
            timeout: null,
            inputs: [(0, _controlled2.default)(this.transformTarget, cx, cy).affine(this.useAffine)]
        }];
        this.targets.get = function (method) {
            var found = this.find(function (item) {
                return item.method == method;
            });
            return found;
        };

        // Set the transformation origin for absolute transforms
        this.toOrigin = null;
        this.fromOrigin = null;
        this.transformOrigin = null;
        this.around(cx, cy);
    },

    construct: {

        declarative: function declarative(controller) {

            if (this.chaser) {

                if (controller) this.chaser.controller(controller);
            } else {
                this.chaser = new SVG.declarative(this).controller(controller);
            }

            // Set the time for the next tick
            this.chaser.targetTime = timer.now();
            return this.chaser;
        }
    },

    extend: {

        /**
         * Methods that directly modify the simulation
         */

        pause: function pause() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.paused = state;
            if (this.paused == false) this.step();
            return this;
        },

        continue: function _continue() {
            if (this.paused) return;
            if (!this.nextFrame) this.step();
            return this;
        },

        override: function override() {
            var should = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.useLast = should;
            return this;
        },

        step: function step(time) {

            // If we are paused, just exit
            if (this.paused) return;

            // Get the time delta
            var dt = this.playSpeed * (time - this.lastTime || 16) / 1000;
            dt = dt < 0.1 ? dt : 0.016; // If we missed alot of time, ignore
            this.lastTime = time;

            // Loop through all of the targets and update them based on
            // the controllers input instruction
            var convergence = 0;
            var controller = this.activeController;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _element;

                    var target = _step.value;


                    // Loop through all of the controllers and update them
                    var inputValues = [];
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = target.inputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var parameter = _step2.value;

                            convergence += parameter.step(controller, dt);
                            var newValue = parameter.value();
                            inputValues.push(newValue);
                        }

                        // Call the modifier to get the parameters in the right
                        // format for the method
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    var modified = inputValues;
                    if (target.modifier) {
                        modified = target.modifier(inputValues);
                    }

                    // Call the correct method on the target object
                    var methodName = target.method.split("_")[0];
                    (_element = this.element)[methodName].apply(_element, _toConsumableArray(modified));
                }

                // Get the next animation frame to keep the simulation going
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (convergence > this.convergenceThreshold) this.nextFrame = draw.frame(this.step.bind(this));else this.nextFrame = null;
            return this;
        },

        speed: function speed(newSpeed) {
            this.playSpeed = newSpeed;
            return this;
        },

        controller: function controller() {
            var newController = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _controllers.spring)();

            this.activeController = newController;
            return this;
        },

        affine: function affine() {
            var useAffine = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


            // If useAffine is true, transformations will occur in an
            // affine manner, otherwise, we will directly morph abcdef
            this.useAffine = useAffine;

            var _targets$get$inputs = _slicedToArray(this.targets.get("transform").inputs, 1),
                matrixC = _targets$get$inputs[0];

            matrixC.affine(useAffine);
            return this;
        },

        around: function around(ox, oy) {

            if (typeof ox == "string") {

                // Get the bounding box and the string provided
                var _element$bbox2 = this.element.bbox(),
                    x = _element$bbox2.x,
                    y = _element$bbox2.y,
                    width = _element$bbox2.width,
                    height = _element$bbox2.height;

                var string = ox.toLowerCase().trim();

                // Set the bounds eg : "bottom-left", "Top right", "middle" etc...
                ox = string.endsWith("left") ? x : string.endsWith("right") ? x + width : x + width / 2;
                oy = string.startsWith("top") ? y : string.startsWith("bottom") ? y + height : y + height / 2;
            }

            // Sets the transformation origin explicitly, by default, the
            // transform origin is around the center of the bbox
            this.transformOrigin = [ox, oy];
            this.fromOrigin = new SVG.Matrix([1, 0, 0, 1, ox, oy]);
            this.toOrigin = this.fromOrigin.inverse();

            // Also change the origin for the matrix controller

            var _targets$get$inputs2 = _slicedToArray(this.targets.get("transform").inputs, 1),
                matrixC = _targets$get$inputs2[0];

            matrixC.center(ox, oy);
            return this;
        },

        threshold: function threshold(newThreshold) {
            this.threshold = newThreshold;
            return this;
        },

        delay: function delay(time) {
            this.targetTime += time / this.playSpeed;
            return this;
        },

        snap: function snap() {

            // Immediately snaps every controller to their current target and
            // zeros out their velocities
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var target = _step3.value;
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = target.inputs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var input = _step4.value;

                            input.snap();
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }
                } // Continue if we've stopped
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            this.continue();
        }

        /**
         * Methods that modify the current targets
         */

        , _addTarget: function _addTarget(method) {
            var targets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            var _this = this;

            var initials = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
                return [];
            };
            var modifier = arguments[3];


            // Work out when to continue
            var waitFor = Math.max(0, this.targetTime - timer.now());
            var target = this.targets.get(method);

            // If the target already exists, delete its timeout
            if (target) {
                if (this.useLast) draw.cancelTimeout(target.timeout);

                // If the target doesn't exist, we have to check if it
                // is possible to control and if so, assign it a controller
            } else {

                // Loop through all of the inputs, and if they are
                // numeric then we have to make them into controllers
                var argumentsControlled = [];
                var init = initials();
                for (var i = 0; i < targets.length; i++) {
                    var start = init[i] === undefined ? targets[i] : init[i];
                    var controlled = (0, _controlled2.default)(start);
                    argumentsControlled.push(controlled);
                }

                // Construct the target for this method
                target = {
                    method: method,
                    inputs: argumentsControlled,
                    modifier: modifier
                };
                this.targets.push(target);
            }

            // Wait for the correct time then change the targets
            target.timeout = draw.timeout(function () {

                // Set the new targets provided directly
                for (var _i = 0; _i < targets.length; _i++) {
                    var methodArgument = target.inputs[_i];
                    var newTarget = targets[_i];
                    methodArgument.target(newTarget);
                }

                // Continue the animation in case it stopped
                _this.continue();
            }, waitFor);
        },

        _bakeTransforms: function _bakeTransforms() {

            // Calculate the net matrix
            var _proposedTransforms = this.proposedTransforms,
                translation = _proposedTransforms.translation,
                rotation = _proposedTransforms.rotation,
                scale = _proposedTransforms.scale,
                flip = _proposedTransforms.flip,
                skew = _proposedTransforms.skew;

            this.transformTarget = translation.multiply(this.fromOrigin).multiply(rotation).multiply(scale).multiply(flip).multiply(skew).multiply(this.toOrigin);

            // Add the target for the new transform
            this._addTarget("transform", [this.transformTarget]);
        },

        _resetTransformProposal: function _resetTransformProposal() {

            this.proposedTransforms = {
                translation: new SVG.Matrix(),
                rotation: new SVG.Matrix(),
                scale: new SVG.Matrix(),
                flip: new SVG.Matrix(),
                skew: new SVG.Matrix()
            };
        },

        _attrStyle: function _attrStyle(key, value, type) {
            var _this2 = this;

            if ((typeof key === "undefined" ? "undefined" : _typeof(key)) == 'object') {

                // We are dealing with an object, so loop over it
                var obj = key;

                // Iterate over the keys and values and run them
                for (var _key in obj) {
                    if (obj.hasOwnProperty(_key)) {
                        this[type](_key, obj[_key]);
                    }
                }
            } else {
                var startValue = function startValue() {
                    return [key, _this2.element[type](key)];
                };
                this._addTarget(type + "_" + key, [key, value], startValue);
            }
        }

        // Properties

        , attr: function attr(key, value) {
            this._attrStyle(key, value, "attr");
            return this;
        },

        style: function style(key, value) {
            this._attrStyle(key, value, "style");
            return this;
        }

        // Basic movements

        , x: function x(_x7, relative) {
            var _this3 = this;

            if (this.element instanceof SVG.G) {

                // TODO: Deal with groups by using a transform

            } else {

                // Add an x target directly
                this._addTarget("x", [relative ? _x7 + this.element.x() : _x7], function () {
                    return [_this3.element.x()];
                });
            }
            return this;
        },

        y: function y(_y, relative) {
            var _this4 = this;

            if (this.element instanceof SVG.G) {

                // TODO: Deal with groups by using a transform

            } else {

                // Add a y target directly
                this._addTarget("y", [relative ? _y + currentY : _y], function () {
                    return [_this4.element.y()];
                });
            }
            return this;
        },

        move: function move(x, y, relative) {
            this.x(x, relative).y(y, relative);
            return this;
        },

        cx: function cx(x, relative) {

            // Get the bounding boxes width to subtract off of the x
            var oX = this.element.bbox().width / 2;
            this.x(x - oX, relative);
            return this;
        },

        cy: function cy(y, relative) {

            // Get the bounding boxes width to subtract off of the x
            var oY = this.element.bbox().height / 2;
            this.y(y - oY, relative);
            return this;
        },

        center: function center(x, y, relative) {
            this.cx(x, relative).cy(y, relative);
            return this;
        }

        // Transformations

        , matrix: function matrix(_matrix) {
            var relative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


            this._resetTransformProposal();
            this.transformTarget = relative ? this.transformTarget.multiply(_matrix) : _matrix;
            this._addTarget("transform", [this.transformTarget]);
            return this;
        },

        rotate: function rotate(theta) {
            var relative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


            // Calculate the rotation matrix
            var thetaRad = Math.PI * theta / 180;
            var _ref = [Math.cos(thetaRad), Math.sin(thetaRad)],
                c = _ref[0],
                s = _ref[1];

            var rotation = new SVG.Matrix([c, s, -s, c, 0, 0]);

            // We set the proposed transform and bake it if necessary,
            // otherwise, we just apply it as a relative matrix
            this.proposedTransforms.rotation = rotation;
            if (relative) this.matrix(rotation, relative);else this._bakeTransforms();
            return this;
        },

        translate: function translate(x, y) {
            var relative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


            // Construct the matrix
            var translation = new SVG.Matrix([1, 0, 0, 1, x, y]);

            // We set the proposed transform and bake it if necessary,
            // otherwise, we just apply it as a relative matrix
            this.proposedTransforms.translation = translation;
            if (relative) this.matrix(translation, relative);else this._bakeTransforms();
            return this;
        },

        scale: function scale(sx, sy) {
            var relative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


            // The user can provide only one scale for a proportional scale
            if (!isFinite(sy)) {
                relative = sy || relative;
                sy = sx;
            }

            // Build the scale matrix
            var scale = new SVG.Matrix([sx, 0, 0, sy, 0, 0]);

            // We set the proposed transform and bake it if necessary,
            // otherwise, we just apply it as a relative matrix
            this.proposedTransforms.scale = scale;
            if (relative) this.matrix(scale, relative);else this._bakeTransforms();
            return this;
        },

        flip: function flip() {
            var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "x";
            var relative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


            // Build the flip matrix
            if (relative) {
                var flip = new SVG.Matrix();
                flip[direction == "x" ? "a" : "d"] = -1;
                this.matrix(scale, relative);
            } else {

                // Flip the respective entry in the flip matrix
                this.proposedTransforms.flip[direction == "x" ? "a" : "d"] *= -1;
                this._bakeTransforms();
            }
            return this;
        },

        skew: function skew(lamX, lamY) {
            var relative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


            // The user can provide only one skew for a proportional skew
            if (!isFinite(sy)) {
                relative = lamY || relative;
                lamY = lamX;
            }

            // Calculate the skew matrix
            var skew = new SVG.Matrix([1, lamY, lamX, 1, 0, 0]);

            // Modify the current matrix
            this.proposedTransforms.skew = skew;
            if (relative) this.matrix(skew, relative);else this._bakeTransforms();
            return this;
        }

        // Syntax Sugar

        , position: function position(x, y) {

            // Forcibly place the center at the x, y position given
            var _transformOrigin = _slicedToArray(this.transformOrigin, 2),
                cx = _transformOrigin[0],
                cy = _transformOrigin[1];

            this.translate(x - cx, y - cy, false);
            return this;
        },

        width: function width(item) {
            this.attr("width", item);
            return this;
        },

        height: function height(item) {
            this.attr("height", item);
            return this;
        },

        fill: function fill(item) {

            // Strings are always assumed to be fills
            if (typeof item == "string") {

                this.attr("fill", item);

                // If we have an object, set the individual attributes
            } else if ((typeof item === "undefined" ? "undefined" : _typeof(item)) == "object") {

                if (item.color) this.attr("fill", item.color);

                if (item.opacity) this.attr("fill-opacity", item.opacity);
            }
            return this;
        },

        stroke: function stroke(item) {

            // If we have an object, set the individual attributes
            if (typeof item == "string") {

                this.attr("stroke", item);
            } else if ((typeof item === "undefined" ? "undefined" : _typeof(item)) == "object") {

                if (item.color) this.attr("stroke", item.color);

                if (item.opacity) this.attr("stroke-opacity", item.opacity);

                if (item.width) this.attr("stroke-width", item.width);

                if (item.lineCap) this.attr("stroke-linecap", item.lineCap);

                if (item.dashArray) this.attr("stroke-dasharray", item.dashArray);
            }
            return this;
        },

        opacity: function opacity(amount) {
            this.attr("opacity", amount);
            return this;
        }

    }
});

SVG.controllers = {
    spring: _controllers.spring
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = Control;

var _affine = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConstantC = function () {
    function ConstantC(value) {
        _classCallCheck(this, ConstantC);

        this.target(value);
    }

    _createClass(ConstantC, [{
        key: "target",
        value: function target(value) {
            this.constant = value;
        }
    }, {
        key: "value",
        value: function value() {
            return this.constant;
        }
    }, {
        key: "step",
        value: function step(controller, dt) {
            return 0;
        }
    }, {
        key: "snap",
        value: function snap() {
            // Does nothing.
        }
    }]);

    return ConstantC;
}();

var NumberC = function () {
    function NumberC(target, min, max) {
        _classCallCheck(this, NumberC);

        this.reset(target);
        this.min = min;
        this.max = max;
    }

    _createClass(NumberC, [{
        key: "reset",
        value: function reset(newValue) {
            this.currentTarget = Number(newValue);
            this.position = Number(newValue);
            this.error = 0;
            this.velocity = 0;
            this.acceleration = 0;
            this.integral = 0;
        }
    }, {
        key: "target",
        value: function target(newTarget) {
            if (isFinite(newTarget)) {
                this.currentTarget = Number(newTarget);
                this.error = this.position - this.currentTarget;
            }
            return this.currentTarget;
        }
    }, {
        key: "value",
        value: function value() {
            var value = value < this.min ? this.min : value > this.max ? this.max : this.position;
            return this.position;
        }
    }, {
        key: "step",
        value: function step(controller, dt) {

            // Use the controller to determine what the new parameters should be
            var _controller = controller(this.error, this.velocity, this.acceleration, this.integral),
                _controller2 = _slicedToArray(_controller, 3),
                sNew = _controller2[0],
                vNew = _controller2[1],
                aNew = _controller2[2];

            this.position = isFinite(sNew) ? sNew : this.position;
            this.velocity = isFinite(vNew) ? vNew : this.velocity;
            this.acceleration = isFinite(aNew) ? aNew : this.acceleration;

            // Use Eulers method to update the velocity and the error
            this.position += this.velocity * dt + this.acceleration * dt * dt / 2;
            this.velocity += this.acceleration * dt;

            // Use the position to calculate the new error and its integral
            var newError = this.position - this.currentTarget;
            this.integral += dt * (this.error + newError) / 2; // Trapezoidal rule
            this.error = newError;

            // If the controller isn't doing anything, we consider it converged
            var convergence = Math.abs((sNew || 0) + (vNew || 0) + (aNew || 0));
            return convergence;
        }
    }, {
        key: "snap",
        value: function snap() {
            this.position = this.currentTarget;
            this.velocity = 0;
            this.acceleration = 0;
            this.integral = 0;
            this.error = 0;
        }
    }]);

    return NumberC;
}();

var CircularC = function (_NumberC) {
    _inherits(CircularC, _NumberC);

    function CircularC(target, min, max) {
        _classCallCheck(this, CircularC);

        var _this = _possibleConstructorReturn(this, (CircularC.__proto__ || Object.getPrototypeOf(CircularC)).call(this, target, min, max));

        _this.range = max - min;
        _this.getError = CircularC.circularDifference(min, max);
        return _this;
    }

    _createClass(CircularC, [{
        key: "target",
        value: function target(newTarget) {
            if (isFinite(newTarget)) {
                this.currentTarget = Number(newTarget);
                this.error = this.getError(this.currentTarget, this.position);
            }
            return this.currentTarget;
        }
    }, {
        key: "step",
        value: function step(controller, dt) {

            this.position = this.min + CircularC.mod(this.position, this.range);
            this.error = this.getError(this.position - this.min, this.currentTarget);
            var convergence = _get(CircularC.prototype.__proto__ || Object.getPrototypeOf(CircularC.prototype), "step", this).call(this, controller, dt);
            return convergence;
        }
    }], [{
        key: "circularDifference",
        value: function circularDifference(min, max) {

            // Form the circular difference function
            var diff = max - min;
            function circular(target, angle) {
                return CircularC.mod(target - angle + diff / 2, diff) - diff / 2;
            }
            return circular;
        }

        // Define a modulo function since javascript doesn't behave properly

    }, {
        key: "mod",
        value: function mod(a, n) {
            return a - n * Math.floor(a / n);
        }
    }]);

    return CircularC;
}(NumberC);

var MatrixC = function () {
    function MatrixC() {
        var matrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new SVG.Matrix();
        var cx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var cy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, MatrixC);

        // Store all of the parameters
        this.currentMatrix = matrix;
        this.thetaController = new CircularC(0, 0, 360);
        this.controllers = [new NumberC(matrix.a), new NumberC(matrix.b), new NumberC(matrix.c), new NumberC(matrix.d), new NumberC(matrix.e), new NumberC(matrix.f)];

        // If we want an affine transformation, we find the parameters
        this.cx = cx;
        this.cy = cy;
        this.useAffine = false; // If true, it will be set below
    }

    _createClass(MatrixC, [{
        key: "center",
        value: function center(cx, cy) {
            this.cx = cx;
            this.cy = cy;
            return this;
        }
    }, {
        key: "affine",
        value: function affine() {
            var useAffine = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


            // Work out if we need to modify the targets
            var toggled = Boolean(this.useAffine ^ useAffine);
            this.useAffine = useAffine;

            // Convert the targets to affine or vice versa
            if (toggled) this.target(this.currentMatrix, true);
            return this;
        }
    }, {
        key: "target",
        value: function target(matrix) {
            var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


            // Extract the parameters
            var v = null;
            if (this.useAffine) {

                // Decompose the matrix into its parameters
                var _decompose = (0, _affine.decompose)(matrix, this.cx, this.cy),
                    translateX = _decompose.translateX,
                    translateY = _decompose.translateY,
                    theta = _decompose.theta,
                    scaleX = _decompose.scaleX,
                    scaleY = _decompose.scaleY,
                    shear = _decompose.shear;

                v = [translateX, translateY, theta, scaleX, scaleY, shear];

                // Set the angular controller correctly
                this.thetaController[reset ? "reset" : "target"](theta);
            } else {
                v = [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
            }

            // Set the new target for each controller
            this.controllers.forEach(function (c, i) {
                return c[reset ? "reset" : "target"](v[i]);
            });
        }
    }, {
        key: "value",
        value: function value() {
            return this.currentMatrix;
        }
    }, {
        key: "step",
        value: function step(controller, dt) {

            // Step through all of the numbers, updating them
            var convergence = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.controllers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var number = _step.value;

                    convergence += number.step(controller, dt);
                }

                // Extract the current matrix from this
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (this.useAffine) {

                // Get the affine parameters and add on the center point
                var parameters = this.controllers.map(function (c) {
                    return c.value();
                }).concat([this.cx, this.cy]);

                // Replace the theta value for the one from the theta controller
                convergence += this.thetaController.step(controller, dt);
                parameters[2] = this.thetaController.value();

                // Compose the affine parameters into a matrix
                this.currentMatrix = _affine.compose.apply(undefined, _toConsumableArray(parameters));
            } else {

                // If we are not using affine transforms, just return directly
                var values = this.controllers.map(function (c) {
                    return c.value();
                });
                this.currentMatrix = new SVG.Matrix(values);
            }

            // Return the convergence error
            return convergence;
        }
    }, {
        key: "snap",
        value: function snap() {

            // Snap the main controllers
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.controllers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var controller = _step2.value;

                    controller.snap();
                }

                // Snap the theta controller
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.thetaController.snap();
        }
    }]);

    return MatrixC;
}();

var ArrayC = function () {
    function ArrayC(string) {
        _classCallCheck(this, ArrayC);
    }

    _createClass(ArrayC, [{
        key: "target",
        value: function target(colorString) {}
    }, {
        key: "value",
        value: function value() {}
    }, {
        key: "step",
        value: function step(controller, dt) {}
    }], [{
        key: "matches",
        value: function matches(item) {}
    }]);

    return ArrayC;
}();

// TODO: Allow svg d elements to animate by picking out their numbers and
// replacing them all


var numbers = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/i;

var StringC = function () {
    function StringC() {
        _classCallCheck(this, StringC);
    }

    _createClass(StringC, [{
        key: "construct",
        value: function construct(string) {

            //
            this.values = [];
            this.template = string.replace(numbers, function (match) {

                // Parse the match as a number
                var value = window.Number(match);
                var controller = new Number();
                return "__v__";
            });
        }
    }, {
        key: "target",
        value: function target(colorString) {}
    }, {
        key: "value",
        value: function value() {}
    }, {
        key: "step",
        value: function step(controller, dt) {}
    }], [{
        key: "matches",
        value: function matches(item) {}
    }]);

    return StringC;
}();

var ColorC = function () {
    function ColorC(string) {
        _classCallCheck(this, ColorC);

        this.targets = [new NumberC(0), new NumberC(0), new NumberC(0)];
        this.target(string);
    }

    _createClass(ColorC, [{
        key: "target",
        value: function target(color) {

            // Get the new values from the color
            var values = null;
            if (color instanceof Array) {
                values = color.map(function (v) {
                    return parseInt(v);
                });
            } else if (typeof color == "string") {

                var hexMatch = color.match(SVG.regex.hex);
                var rgbMatch = color.match(SVG.regex.rgb);
                values = hexMatch ? hexMatch.splice(1).map(function (v) {
                    return parseInt(v, 16);
                }) : rgbMatch.splice(1).map(function (v) {
                    return parseInt(v);
                });
            } else return;

            // Set the new targets
            this.targets.forEach(function (target, i) {
                return target.target(values[i]);
            });

            // Return the values for use
            return values;
        }
    }, {
        key: "value",
        value: function value() {

            // Get the numbers and bound them to an int between [0, 255]
            var values = this.targets.map(function (v) {
                var value = Math.floor(v.value());
                value = value < 0 ? 0 : value > 255 ? 255 : value;
                return value;
            });
            var valueString = values.join(", ");
            var rgbString = "rgb(" + valueString + ")";
            return rgbString;
        }
    }, {
        key: "step",
        value: function step(controller, dt) {
            var convergence = 0;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.targets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var target = _step3.value;

                    convergence += target.step(controller, dt);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return convergence;
        }
    }, {
        key: "snap",
        value: function snap() {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.targets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var controller = _step4.value;

                    controller.snap();
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }], [{
        key: "matches",
        value: function matches(item) {
            if (typeof item !== "string") return false;
            var isHex = SVG.regex.isHex.test(item);
            var isRgb = SVG.regex.isRgb.test(item);
            return isRgb || isHex;
        }
    }]);

    return ColorC;
}();

function Control(value) {

    // If we have any of the correct types, then we should control them
    if (value instanceof SVG.Matrix) return new (Function.prototype.bind.apply(MatrixC, [null].concat(Array.prototype.slice.call(arguments))))();else if (ColorC.matches(value)) return new (Function.prototype.bind.apply(ColorC, [null].concat(Array.prototype.slice.call(arguments))))();else if (isFinite(value)) return new (Function.prototype.bind.apply(NumberC, [null].concat(Array.prototype.slice.call(arguments))))();else return new (Function.prototype.bind.apply(ConstantC, [null].concat(Array.prototype.slice.call(arguments))))();
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.spring = spring;
function spring() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$settleTime = _ref.settleTime,
        settleTime = _ref$settleTime === undefined ? 500 : _ref$settleTime,
        _ref$overShoot = _ref.overShoot,
        overShoot = _ref$overShoot === undefined ? 15 : _ref$overShoot;

    // Calculate the PID natural response
    var eps = 1e-10;
    var os = overShoot / 100 + eps;
    var zeta = -Math.log(os) / Math.sqrt(Math.pow(Math.PI, 2) + Math.pow(Math.log(os), 2));
    var wn = 4 / (zeta * settleTime / 1000);

    // Calculate the Spring values
    var D = 2 * zeta * wn;
    var K = wn * wn;

    // Return the acceleration required
    return function (error, velocity, acceleration, integral) {
        var control = -D * velocity - K * error;
        return [,, control];
    };
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawLoop = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queue = __webpack_require__(5);

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DrawLoop = exports.DrawLoop = function () {
    function DrawLoop() {
        _classCallCheck(this, DrawLoop);

        this.nextDraw = null;
        this.frames = new _queue2.default();
        this.timeouts = new _queue2.default();
        this.frameCount = 0;
        this.timeoutCount = 0;
        this.timer = performance;
        this.drawIt = this._draw.bind(this);
    }

    _createClass(DrawLoop, [{
        key: "frame",
        value: function frame(method) {
            this.frames.push({
                id: this.frameCount,
                run: method
            });
            if (this.nextDraw === null) this.nextDraw = requestAnimationFrame(this.drawIt);
            return this.frameCount++;
        }
    }, {
        key: "timeout",
        value: function timeout(method) {
            var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


            // Work out when the event should fire
            var time = this.timer.now() + delay;

            // Add the timeout to the end of the queue
            var thisId = this.timeoutCount++;
            this.timeouts.push({
                id: thisId,
                run: method,
                time: time
            });

            // Request another animation frame if we need one
            if (this.nextDraw === null) this.nextDraw = requestAnimationFrame(this.drawIt);
            return thisId;
        }
    }, {
        key: "cancelTimeout",
        value: function cancelTimeout(id) {

            // Find the index of the timeout to cancel and remove it
            var index = this.timeouts.remove(function (t) {
                return t.id == id;
            });
        }
    }, {
        key: "_draw",
        value: function _draw(now) {

            // Run all the timeouts we can run, if they are not ready yet, add them
            // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
            var tracking = true,
                nextTimeout = null;
            var lastTimeoutId = this.timeouts.peekLast() && this.timeouts.peekLast().id;
            while (tracking && (nextTimeout = this.timeouts.shift())) {

                // If we hit the last item, we should stop shifting out more items
                if (nextTimeout.id == lastTimeoutId) tracking = false;

                // Run the timeout if its time, or push it to the end
                if (now > nextTimeout.time) nextTimeout.run();else this.timeouts.push(nextTimeout);
            }

            // Run all of the frames available up until this point
            var lastFrameId = this.frameCount;
            while (this.frames.peek() && this.frames.peek().id < lastFrameId) {
                var nextFrame = this.frames.shift();
                nextFrame.run(now);
            }

            // If we have remaining timeouts or frames, draw until we don't anymore
            this.nextDraw = this.timeouts.length > 0 || this.frames.length > 0 ? requestAnimationFrame(this.drawIt) : null;
        }
    }]);

    return DrawLoop;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = function () {
    function Queue() {
        _classCallCheck(this, Queue);

        this.first = undefined;
        this.last = undefined;
        this.length = 0;
        this.id = 0;
    }

    _createClass(Queue, [{
        key: "push",
        value: function push(value) {
            var node = { id: this.id++, value: value };
            if (this.last) this.last = this.last.next = node;else this.last = this.first = node;
            this.length++;
        }
    }, {
        key: "shift",
        value: function shift() {
            if (this.length == 0) return;
            var remove = this.first;
            this.first = remove.next;
            this.last = --this.length ? this.last : undefined;
            return remove.value;
        }
    }, {
        key: "peek",
        value: function peek() {
            if (this.first) return this.first.value;
        }
    }, {
        key: "peekLast",
        value: function peekLast() {
            if (this.last) return this.last.value;
        }
    }, {
        key: "remove",
        value: function remove(matcher) {

            // Find the first match
            var previous = null,
                current = this.first;
            while (current) {

                // If we have a match, we are done
                if (matcher(current.value)) break;

                // Otherwise, advance both of the pointers
                previous = current;
                current = current.next;
            }

            // If we got the first item, adjust the first pointer
            if (current && current.id == this.first.id) this.first = this.first.next;

            // If we got the last item, adjust the last pointer
            if (current && current.id == this.last.id) this.last = previous;

            // If we got an item, fix the list and return the item
            if (current) {
                this.length--;
                if (previous) previous.next = current.next;
                return current.item;
            }
        }
    }]);

    return Queue;
}();

exports.default = Queue;

/***/ })
/******/ ]);
//# sourceMappingURL=svg.declarative.js.map