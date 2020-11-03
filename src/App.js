import React, { useState, useRef, useEffect } from "react";
import { useInterval } from './useInterval';
import {
    CANVAS_SIZE,
    SNAKE_START,
    APPLE_START,
    SCALE,
    SPEED,
    DIRECTIONS,
} from './constants.js'

const App = () => {
    const canvasRef = useRef();
    const [snake, setSnake] = useState(SNAKE_START);
    const [apple, setApple] = useState(APPLE_START);
    const [dir, setDir] = useState([0, -1]);
    const [speed, setSpeed] = useState(SPEED);
    const [gameOver, setGameover] = useState(false);
    const [score, setScore] = useState(0);
    const scoreFactor = 1;
    let maxScore = 0;

    if (localStorage.getItem("score")) {
        maxScore = JSON.parse(localStorage.getItem("score"));
    }

    const startGame = () => {
        setSnake(SNAKE_START);
        setApple(APPLE_START);
        setDir([0, -1]);
        setSpeed(SPEED);
        setGameover(false);
    }

    const endGame = () => {
        setSpeed(null);
        setGameover(true);
    }

    const moveSnake = ({ keyCode }) => {
        if (keyCode >= 37 && keyCode <= 40) {
            setDir(DIRECTIONS[keyCode]);
        }
    }

    const createApple = () => apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

    const checkCollision = (piece, snk = snake) => {
        if (
            piece[0] * SCALE >= CANVAS_SIZE[0] ||
            piece[0] < 0 ||
            piece[1] * SCALE >= CANVAS_SIZE[1] ||
            piece[1] < 0
        )
            return true;

        for (const segment of snk) {
            if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
        }
        return false;
    };

    const checkAppleCollision = (newSnake) => {
        if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
            let newApple = createApple();
            while (checkCollision(newApple, newSnake)) {
                newApple = createApple();
            }
            setApple(newApple);
            return true;
        }

        return false;
    }

    const gameLoop = () => {
        // Head é sempre o primeiro elemento do array;
        // snakeCopy[0][0] = X
        // snakeCopy[0][1] = Y
        // dir[0] = X
        // dir[1] = Y
        const snakeCopy = JSON.parse(JSON.stringify(snake));
        const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];

        snakeCopy.unshift(newSnakeHead);

        if (checkCollision(newSnakeHead)) {
            endGame();
        }

        if (!checkAppleCollision(snakeCopy)) {
            setScore(snakeCopy.length * scoreFactor);
            if (score > maxScore) {
                localStorage.setItem("score", JSON.stringify(score));
            }
            snakeCopy.pop();
        }

        setSnake(snakeCopy);
    }

    useEffect(() => {
        const context = canvasRef.current.getContext("2d");
        context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
        context.fillStyle = "purple";

        snake.forEach(([x, y]) => {
            context.fillRect(x, y, 1, 1);
        });

        context.fillStyle = "red";
        context.fillRect(apple[0], apple[1], 1, 1);
    }, [snake, apple, gameOver])

    useInterval(() => gameLoop(), speed);

    return (
        <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
            <canvas
                style={{
                    border: "1px solid black",
                    margin: "0 auto",
                    display: "block",
                }}
                ref={canvasRef}
                width={`${CANVAS_SIZE[0]}px`}
                height={`${CANVAS_SIZE[1]}px`}
            />
            <br/>
            <div className="container">
                {gameOver && <div style={{
                    textAlign: "center"
                }}><h1>GAME OVER!</h1></div>}
                <button onClick={startGame}>Start Game</button>
                <br/>
                <br />
                <p>pontuação: {score}</p>
                <p>pontuação mais alta: {maxScore}</p>
            </div>
        </div>
    );
}

export default App;


// const checkCollisionToImprove = (piece, snk = snake) => {
//     for (const segment of snk) {
//         // CALCULAR COM A CABEÇA -1 e o RABO com +1;
//         if (piece[0] === segment[0] && piece[1] === segment[1]) {
//             console.log(' ');
//             console.log('snake.length', snake.length);
//             console.log(' ');

//             console.log('CANVAS_SIZE[0]', CANVAS_SIZE[0]);
//             console.log('CANVAS_SIZE[1]', CANVAS_SIZE[1]);
//             console.log('piece[0]', piece[0] * SCALE);
//             console.log('piece[1]', piece[1] * SCALE);
//             console.log('segment[0]', segment[0] * SCALE);
//             console.log('segment[1]', segment[1] * SCALE);
//             return true;
//         }
//     }

//     if (piece[0] * SCALE > CANVAS_SIZE[0]) {
//         console.log('right');
//         console.log('piece[0]', piece[0]);
//         console.log('piece[0] * SCALE >= CANVAS_SIZE[0]', piece[0] * SCALE);
//         console.log('CANVAS_SIZE[0]', CANVAS_SIZE[0]);
//         piece[0] = 0;
//     }

//     if (piece[0] < 0) {
//         console.log('left');
//         console.log('piece[0]', piece[0]);
//         piece[0] = 20;
//     }

//     if (piece[1] * SCALE > CANVAS_SIZE[1]) {
//         console.log('bot');
//         console.log('piece[1]', piece[1]);
//         piece[1] = 0;
//     }

//     if (piece[1] < 0) {
//         console.log('top');
//         console.log('piece[0]', piece[0]);
//         console.log('piece[1]', piece[1]);
//         piece[1] = 20;
//     }

//     return false;
// }