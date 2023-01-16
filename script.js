const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardHeight = 300
const boardWidth = 560
let score = 0
let timerId
let xDirection = 2
let yDirection = 2

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPos = ballStart

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(230, 240),
    new Block(120, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210)
]

const addBlocks = () => {
    for (let bloq in blocks) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = `${blocks[bloq].bottomLeft[0]}px`
        block.style.bottom = `${blocks[bloq].bottomLeft[1]}px`
        grid.appendChild(block)
    }
}

addBlocks()

const drawUser = () => {
    user.style.left = `${currentPosition[0]}px`
    user.style.bottom = `${currentPosition[1]}px`
}

const drawBall = () => {
    ball.style.left = `${ballCurrentPos[0]}px`
    ball.style.bottom = `${ballCurrentPos[1]}px`
}


const user = document.createElement('div')
user.classList.add('user')
drawUser()
grid.appendChild(user)


function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 10
                drawUser()
            }
            break
        case 'ArrowRight':
            if (currentPosition[0] < 460) {
                currentPosition[0] += 10
                drawUser()
            }
            break
    }
}

document.addEventListener('keydown', moveUser)


const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)


const moveBall = () => {
    ballCurrentPos[0] += xDirection
    ballCurrentPos[1] += yDirection
    drawBall()
    checkCollisions()
}

timerId = setInterval(moveBall, 30)

const changeDirection = () => {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2
        return
    }
}

const checkCollisions = () => {
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPos[0] > blocks[i].bottomLeft[0] && ballCurrentPos[0] < blocks[i].bottomRight[0]) &&
            (ballCurrentPos[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPos[1] < blocks[i].topLeft[1]
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1)
            changeDirection()
            score++;
            scoreDisplay.textContent = score

            // Check for win
            if (blocks.length === 0) {
                scoreDisplay.textContent = 'You won. Yay! :D'
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
            }
        }
    }

    if ((ballCurrentPos[0] > currentPosition[0] && ballCurrentPos[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPos[1] > currentPosition[1] && ballCurrentPos[1] < currentPosition[1] + blockHeight)) {
        changeDirection()
    }

    if (ballCurrentPos[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPos[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPos[0] <= 0) {
        changeDirection()
    }

    if (ballCurrentPos[1] <= 0) {
        scoreDisplay.textContent = 'You lost! :('
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
    }
}
