// When the ball isn't moving, the A button can start the game by giving the ball a velocity
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (ballSprite.vx == 0) {
        list2 = [50, -50]
        ballXSpeed = list2._pickRandom()
        ballSprite.setVelocity(ballXSpeed, startingYSpeed * -1)
    }
})
// When the ball overlaps with the paddle, set the velocity to make the ball go back up at the correct speed
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Player, function (sprite, otherSprite) {
    // The -1 is so the ball cant bounce even if it hits just the bottom of the paddle
    if (ballSprite.y < paddleSprite.y - 1) {
        // Include speed multiplier in both operations to make the ball move the correct speed based on the multiplier
        ballSprite.vy = startingYSpeed * (speedMultiplier * -1)
        ballSprite.vx = (ballSprite.x - paddleSprite.x) * 6 * speedMultiplier
        music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
        // Update the X velocity variable to recall when the ball bounces off the side of a brick
        ballXSpeed = (ballSprite.x - paddleSprite.x) * 6 * speedMultiplier
    }
})
// Function to create grid of bricks
// Loop to create each row of bricks
function placeBricks (brickImg: Image, spriteWidth: number, spriteHeight: number) {
    let j: number;
// Calculate amount of bricks that will fit
    cols = Math.floor(158 / spriteWidth)
    rows = Math.floor(50 / spriteHeight)
    brickAmount = cols * rows
    while (i <= rows - 1) {
        // Inner loop to create each column of bricks for every row
        j = 0
        while (j <= cols - 1) {
            // Create sprite
            brickSprite = sprites.create(brickImg, SpriteKind.Enemy)
            // Place sprite in grid position using number of rows and columns completed as coordinates
            brickSprite.setPosition(j * spriteWidth + brickGap * j + brickGap / 2, i * spriteHeight + brickGap * i + brickGap / 2)
            brickSprite.x += spriteWidth / 2
            brickSprite.y += 15
            j += 1
        }
        i += 1
    }
}
// Function to destroy bricks
// To be used within overlap function to make ball bounce off bricks
function destroyBrick (brick: Sprite) {
    // Destroys brick hit by ball
    sprites.destroy(brick, effects.ashes, 200)
    // Add point to score
    info.setScore(info.score() + 1)
    music.play(music.melodyPlayable(music.smallCrash), music.PlaybackMode.InBackground)
}
// Detecting overlap to allow ball to bounce off sprites
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite2, otherSprite2) {
    // Detect which side the ball bounces off of to determine which variable of ball velocity to change
    // This is detected by comparing coordinates of the ball and brick overlapped
    if (ballSprite.y >= otherSprite2.y + brickHeight / 2) {
        console.log("down")
        // Update ball speed including speed multiplier
        ballSprite.vy = startingYSpeed * speedMultiplier
        destroyBrick(otherSprite2)
    } else if (ballSprite.y <= otherSprite2.y - brickHeight / 2) {
        console.log("up")
        // Update ball speed including speed multiplier
        ballSprite.vy = startingYSpeed * speedMultiplier * -1
        destroyBrick(otherSprite2)
    } else if (ballSprite.x >= otherSprite2.x + brickWidth / 2) {
        console.log("right")
        // Update ball speed
        ballXSpeed = Math.abs(ballXSpeed)
        ballSprite.vx = ballXSpeed
        console.log(ballXSpeed)
        destroyBrick(otherSprite2)
    } else if (ballSprite.x <= otherSprite2.x - brickWidth / 2) {
        console.log("left")
        // Update ball speed
        ballXSpeed = Math.abs(ballXSpeed) * -1
        ballSprite.vx = ballXSpeed
        console.log(ballXSpeed)
        destroyBrick(otherSprite2)
    }
})
let brickSprite: Sprite = null
let i = 0
let rows = 0
let cols = 0
let list2: number[] = []
let ballXSpeed = 0
let speedMultiplier = 0
let startingYSpeed = 0
let ballSprite: Sprite = null
let paddleSprite: Sprite = null
let brickAmount = 0
let brickGap = 0
let brickWidth = 0
let brickHeight = 0
let brickImg2 = assets.image`brickImg`
brickGap = 2
brickAmount = 0
brickWidth = brickImg2.width
brickHeight = brickImg2.height
placeBricks(brickImg2, brickWidth, brickHeight)
// Create a default score target that is 1/6 of the amount of bricks
let defaultScoreTarget = brickAmount / 6
// Set background color
scene.setBackgroundColor(9)
// Create paddle and ball
paddleSprite = sprites.create(assets.image`paddleImg`, SpriteKind.Player)
ballSprite = sprites.create(assets.image`ballImg`, SpriteKind.Projectile)
// Make ball bounce on walls
ballSprite.setBounceOnWall(true)
// Set position of ball and paddle at bottom middle of screen
ballSprite.setPosition(80, 100)
paddleSprite.setPosition(80, 110)
// Allow paddle sprite to move back and forth on screen
controller.moveSprite(paddleSprite, 100, 0)
paddleSprite.setStayInScreen(true)
// Set default speed and multiplier
startingYSpeed = 50
speedMultiplier = 1
// Set first score target to default
let scoreTarget = defaultScoreTarget
// Set amount of lives
info.setLife(3)
// Variable to keep track of X speed of ball (to include speed given by paddle and speed multipier)
ballXSpeed = 0
// Function to check variables every game update
game.onUpdate(function () {
    // Detect if ball has hit bottom of screen
    if (ballSprite.y > 115) {
        // Subtract a life and reset ball
        info.changeLifeBy(-1)
        ballSprite.setVelocity(0, 0)
        ballSprite.setPosition(80, 100)
        paddleSprite.setPosition(80, 110)
        // Reset speed multiplier
        speedMultiplier = 1
        scoreTarget = info.score() + 8
        music.play(music.melodyPlayable(music.buzzer), music.PlaybackMode.InBackground)
        // Detect if player has lives left
        if (info.life() == 0) {
            // If not end game with loss
            game.gameOver(false)
            game.setGameOverEffect(false, effects.splatter)
            music.play(music.melodyPlayable(music.wawawawaa), music.PlaybackMode.InBackground)
        } else {
            // If they have lives left tell user they lost a life
            game.showLongText("Life Lost!", DialogLayout.Center)
        }
    }
    // Detect if user has reached a score target
    if (info.score() >= scoreTarget) {
        // Increase score target by predetermined amount when reached
        scoreTarget += defaultScoreTarget
        // Increase ball speed multiplier
        speedMultiplier += 0.2
    }
    // Detect if score matches amount of bricks destroyed
    if (info.score() >= brickAmount) {
        // If it does end game with win
        game.gameOver(true)
        game.setGameOverEffect(true, effects.confetti)
        music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
    }
    if (ballSprite.x <= 4) {
        ballXSpeed = Math.abs(ballXSpeed)
        console.log("left wall")
    } else if (ballSprite.x >= 156) {
        ballXSpeed = Math.abs(ballXSpeed) * -1
        console.log("right wall")
    }
})
