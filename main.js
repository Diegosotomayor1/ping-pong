const DIMENSIONES = {
  width: 800,
  height: 600,
  ball: { width: 20, height: 20 },
  paddle: { width: 100, height: 10 },
  brick: { width: 75, height: 20 },
  brickRowCount: 4,
  brickColumnCount: 8,
  brickPadding: 10,
  brickOffsetTop: 30,
  brickOffsetLeft: 30
}

const ball = {
  x: DIMENSIONES.width / 2 - DIMENSIONES.ball.width / 2,
  y: DIMENSIONES.height / 2 - DIMENSIONES.ball.height / 2,
  radius: 10,
  dx: 5,
  dy: -5
}

const paddle = {
  x: (DIMENSIONES.width - DIMENSIONES.paddle.width) / 2,
  y: DIMENSIONES.height - DIMENSIONES.paddle.height - 10,
  width: DIMENSIONES.paddle.width,
  height: DIMENSIONES.paddle.height
}

const canvas = document.getElementById('pingpongCanvas')
const context = canvas.getContext('2d')

const bricks = Array.from({ length: DIMENSIONES.brickColumnCount }, () =>
  Array.from({ length: DIMENSIONES.brickRowCount }, () => ({
    x: 0,
    y: 0,
    status: 1
  }))
)

function gameWin (numberBricks) {
  if (numberBricks === 0) {
    alert('You win!')
    document.location.reload()
  }
}

function drawBricks () {
  Array.from({ length: DIMENSIONES.brickColumnCount }, (_, col) =>
    Array.from({ length: DIMENSIONES.brickRowCount }, (_, row) => {
      if (bricks[col][row].status === 0) return
      const brickX =
        col * (DIMENSIONES.brick.width + DIMENSIONES.brickPadding) +
        DIMENSIONES.brickOffsetLeft
      const brickY =
        row * (DIMENSIONES.brick.height + DIMENSIONES.brickPadding) +
        DIMENSIONES.brickOffsetTop
      bricks[col][row].x = brickX
      bricks[col][row].y = brickY
      context.beginPath()
      context.rect(
        brickX,
        brickY,
        DIMENSIONES.brick.width,
        DIMENSIONES.brick.height
      )
      context.fillStyle = '#0095DD'
      context.fill()
      context.closePath()
    })
  )
}

function collisionDetection () {
  Array.from({ length: DIMENSIONES.brickColumnCount }, (_, col) =>
    Array.from({ length: DIMENSIONES.brickRowCount }, (_, row) => {
      if (bricks[col][row].status === 0) return
      const brick = bricks[col][row]
      if (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + DIMENSIONES.brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + DIMENSIONES.brick.height
      ) {
        brick.status = 0
        ball.dy = -ball.dy
      }
    })
  )
}

function drawBall () {
  context.beginPath()
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  context.fillStyle = 'red'
  context.fill()
  context.closePath()
}

function drawPaddle () {
  context.beginPath()
  context.rect(paddle.x, paddle.y, paddle.width, paddle.height)
  context.fillStyle = 'blue'
  context.fill()
  context.closePath()
}

function draw () {
  context.clearRect(0, 0, DIMENSIONES.width, DIMENSIONES.height)
  drawBricks()
  drawBall()
  drawPaddle()
  collisionDetection()

  // Colisión con los bordes del canvas
  if (
    ball.x + ball.dx > DIMENSIONES.width - ball.radius ||
    ball.x + ball.dx < ball.radius
  ) {
    ball.dx = -ball.dx
  }

  // Colisión con el techo
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy
  }

  // Colisión con el paddle
  if (
    ball.y + ball.dy > paddle.y &&
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width
  ) {
    ball.dy = -ball.dy
  }

  // Pérdida del juego
  if (ball.y + ball.dy > DIMENSIONES.height - ball.radius) {
    document.location.reload()
  }

  //Ganar el juego
  let numberBricks = 0
  Array.from({ length: DIMENSIONES.brickColumnCount }, (_, col) =>
    Array.from({ length: DIMENSIONES.brickRowCount }, (_, row) => {
      if (bricks[col][row].status === 1) {
        numberBricks++
      }
    })
  )
  gameWin(numberBricks)

  // Movimiento del paddle
  if (rightPressed && paddle.x < DIMENSIONES.width - paddle.width) {
    paddle.x += 7
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 7
  }

  // Actualización de la posición de la pelota
  ball.x += ball.dx
  ball.y += ball.dy
}

let rightPressed = false
let leftPressed = false

document.addEventListener('keydown', movePaddle)

function movePaddle (event) {
  if (event.key === 'Right' || event.key === 'ArrowRight') {
    rightPressed = true
  } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
    leftPressed = true
  }
}

function keyUpHandler (event) {
  if (event.key === 'Right' || event.key === 'ArrowRight') {
    rightPressed = false
  } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
    leftPressed = false
  }
}

document.addEventListener('keyup', keyUpHandler)

gameLoop()

function gameLoop () {
  draw()
  requestAnimationFrame(gameLoop)
}
