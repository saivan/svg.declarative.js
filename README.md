
# svg.declarative.js

> Fast declarative animations for svg.js.

This plugin for SVG.js allows the user to specify only how they want their page to "look" and how long it should take to reach that state. The declarative api is in control of getting you there entirely, which is useful for a number of reasons:
- The target can be changed mid-animation and the animation will figure out how to get there
- The animations are controlled using actual physics, so no more fake looking springs!
- You can have quite a few concurrent animations going at once.

Check out some demos:

- [Simple Mouse follower](https://codepen.io/saivan/pen/zpdwpY)
- [Many body Mouse follower](https://codepen.io/saivan/pen/xpXymb)
- [Vector field Explorer](https://codepen.io/saivan/pen/vpJmQJ)
- [Show me where I Clicked](https://codepen.io/saivan/pen/ZvrpYz)


# Usage

To use this library, just include the SVG.js file in the `distribute` folder for your site and run it after you've included svg.js. The api is quite straightforward and very similar to the native animate api. To make an element declarative just call:

    element.declarative(<controller>)

This will return an `SVG.declarative` object that you can edit the targets for directly. The controller is just a function that you provide with the signature:

    function (error, velocity, acceleration, integral) {
        // Do what you need
        return [newPosition, newVelocity, newAcceleration]
    }

Where:

- `error` is the current difference between the intended value and the required value
- `velocity` is the current amount the error is expected to change over the next second
- `acceleration` is the current amount the velocity is expected to change over the next second
- `integral` is the approximate integral of the error over the last second

This is a powerful abstraction, but __you won't need to define your own controller__ because we provide you with some of our own hand picked controllers that work really nicely.

> Our controllers can be found in `SVG.controllers`

A simple example is the damped spring, which simulates a bouncy spring:

    SVG.controllers.spring({
        overshoot: 15,   // The percentage you want the object to shoot past the target before coming back
        settleTime: 500, // The number of miliseconds before the object should settle
    })

By default, we use this spring as our controller, but you can redefine it or even use another spring. You will probably find these animations surprisingly pleasant :smile:

## Manipulating Declaratives

You can manipulate declaratives by using any of the following methods:

    element.pause(state)

Pauses the currently running animation. If state is true, we force pause, and if false we unpause.

    element.continue()

Continues the animation if it already converged (you probably won't need this yourself).

    element.speed(newspeed)

Sets the speed of the animation.

    element.delay(time)

Sets a delay before activating a new target. This can be useful to sequence animations.

    element.override(should)

If should is true, we always take the last target and ignore all other targets, so if you rapidly set two targets with different delays, we will just take the last one. This happens on a per attribute basis.

    element.step(time)

Advances the animation to the time specified. This is also usually called internally any time you change a target, so you probably won't need to use it yourself.

    element.controller(newController)

Allows you to pass in another function to act as the new controller from this point forward.

    element.affine(useAffine)

If useAffine is true, we attempt to preserve lengths while animating. Otherwise, we will directly morph one transformation into another, which is preferable in some circumstances.

    element.around(center)

If we are using affine transformations, we can set a transformation origin. This will guarantee that the transformations happen around a given origin to avoid any weird warping.

    element.threshold(amount)

If the change in all controllers is below the amount you specify, the simulation has converged, and we stop stepping to avoid animating forever.


## Setting Targets

We can set the targets as we would with animate, we have the same basic functions available with the same api, including:
- x, y, move
- cx, cy, center
- matrix, rotate, translate, scale, flip, skew

We also have `position`, which will always put your center at the center postion provided.

# Local Setup

To set this up, after cloning just run:

    npm install

from the base folder

## Running Examples

The examples found in the examples folder can be run with:

    npm run demo <folder-name>

Where folder name is the folder containing the demo you want to run. This will run a webpack dev server which usually runs at [port 8080 of your localhost](http://localhost:8080/), but it will print the correct port upon startup.

## Building the Source

Just run the build script and it will take care of building everything:

    npm run build

If you get any errors, fix them and try again!
