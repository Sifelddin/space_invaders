
/*
var tween = scene.tweens.add({
    targets: gameObject,
    paused: false,
    callbackScope: tween,

    // timming/callback of each state
    onStart: function () {},
    onStartScope: callbackScope,
    onStartParams: [],

    // initial delay
    delay: 0,  // function(target, targetKey, value, targetIndex, totalTargets, tween) { },

    // tween duration
    duration: 1000,  // function(target, targetKey, value, targetIndex, totalTargets, tween) { },
    ease: 'Linear',
    easeParams: null,

    onActive: function () {},
    onUpdate: function () {},
    onUpdateScope: callbackScope,
    onUpdateParams: [],

    // delay between tween and yoyo
    hold: 0,  // function(target, targetKey, value, targetIndex, totalTargets, tween) { },
    yoyo: false,  // true to tween backward
    flipX: false,
    flipY: false,
    onYoyo: function () {},
    onYoyoScope: callbackScope,
    onYoyoParams: [],

    // repeat count (-1: infinite)
    repeat: 0,  // function(target, targetKey, value, targetIndex, totalTargets, tween) { },
    onRepeat: function () {},
    onRepeatScope: callbackScope,
    onRepeatParams: [],
    // delay to next pass
    repeatDelay: 0,  // function(target, targetKey, value, targetIndex, totalTargets, tween) { },

    // loop count (-1: infinite)
    loop: 0,
    onLoop: function () {},
    onLoopScope: callbackScope,
    onLoopParams: [],
    // delay to next loop
    loopDelay: 0,

    // delay to onComplete callback
    completeDelay: 0,
    onComplete: function () {},
    onCompleteScope: callbackScope,
    onCompleteParams: [],
    // timming/callback of each state

    // properties:
    x: '+=600',        // start from current value
    y: 500,
    rotation: ...
    angle: ...
    alpha: ...
    // ...

    // or
    props: {
        x: { value: '+=600', duration: 3000, ease: 'Power2' },
        y: { value: '500', duration: 1500, ease: 'Bounce.easeOut' }
    },

    // or
    props: {
        x: {
            duration: 400,
            yoyo: true,
            repeat: 8,
            ease: 'Sine.easeInOut',
            value: {
                getActive: function (target, key, value, targetIndex, totalTargets, tween)
                {
                    return value;
                },
                getStart: function (target, key, value, targetIndex, totalTargets, tween)
                {
                    return value + 30;
                },
                getEnd: function (target, key, value, targetIndex, totalTargets, tween)
                {
                    destX -= 30;
                    return destX;
                }
            }
        },
        ....
    },

    offset: null,
    useFrames: false
});
*/
