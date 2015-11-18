/* script file for the Canvas demo */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var canvas = document.getElementById('game-canvas');
    var ctx = canvas.getContext('2d');

    //current game state
    var gameState;

    //create a new game state object
    function newGameState() {
        return {
            ball: {
                left: Math.random() * canvas.width,
                top: Math.random() * canvas.height,
                width: 10,
                height: 10,
                vectorX: 1,
                vectorY: 1,
                velocity: 6
            },
            paddle: {
              left: 20,
              top: 0,
              width: 10,
              height: canvas.height / 6
            },
            lastTimestamp: performance.now()
        };
    } //newGameState()

    //render current game state to canvas element
    function render() {
        //clears entire canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var ball = gameState.ball;
        //begin path
        ctx.beginPath();
        //draw arc
        ctx.arc(ball.left + (ball.width/2),
            ball.top + (ball.height/2),
            ball.width/2, 0 , 2 * Math.PI);
        //fill in the circle
        ctx.fill();

        //render paddle
        var paddle = gameState.paddle;
        ctx.fillRect(paddle.left, paddle.top, paddle.width, paddle.height);

    } //render()

    //advance the animation by one step
    function step() {
        var ball = gameState.ball;
        //move the ball
        ball.left += ball.vectorX * ball.velocity;
        ball.top += ball.vectorY * ball.velocity;

        //bounce if hit right wall
        if (ball.left + ball.width >= canvas.width) {
            ball.vectorX = -ball.vectorX;
        }

        //bounce if hit top or bottom wall
        if (ball.top <= 0 || ball.top + ball.height >= canvas.height) {
            ball.vectorY = -ball.vectorY;
        }

        //bounce if hit paddle
        var paddle = gameState.paddle;
        if (ball.left <= paddle.left + paddle.width) {
            //if bottom of ball is at or below top of paddle
            if (ball.top + ball.height >= paddle.top
                && ball.top <= paddle.top + paddle.height) {
                ball.vectorX = -ball.vectorX;
            } else {
                //game over
                ctx.font = '20 px Helvetica';
                var message = 'Game Over';
                //get width of game over text
                var metrics = ctx.measureText(message);
                ctx.fillText(message, (canvas.width - metrics.width)/2, (canvas.height - 20)/2);
                return false;
            }
        }
        return true;

    } //step()

    //advance the animation and redraw
    function animate(timestamp) {
        var keepGoing = true;
        render();

        //advance animation if 16ms have passed
        if (timestamp - gameState.lastTimestamp > 16) {
            keepGoing = step();
            gameState.lastTimestamp = timestamp;
        }

        //if game is still going, keep animating
        if (keepGoing) {
            requestAnimationFrame(animate);
        }

    }

    document.addEventListener('mousemove', function(evt) {
       var canvasY = evt.clientY - canvas.offsetTop;
        var paddle = gameState.paddle;
        paddle.top = canvasY - (paddle.height / 2);
    });

    gameState = newGameState();

    //ask browser to animate as quickly as possible
    requestAnimationFrame(animate);


    /*
    ctx.fillStyle = ('rgba(255,0,0,0.6'); //left, top, width, height
    ctx.fillRect(20,20,50,60);

    ctx.fillStyle = 'rgba(0,0,255,0.6)';
    ctx.fillRect(40,40,50,60);

    ctx.fillStyle = '#000';
    var idx;
    for (idx = 0; idx < canvas.width; idx += 20) {
        ctx.fillText(idx, idx, 10);
    }
    for (idx = 0; idx < canvas.height; idx += 20) {
        ctx.fillText(idx, 0, idx);
    } //This was for creating/drawing shapes in the webpage */

});
