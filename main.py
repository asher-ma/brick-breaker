# When the ball isn't moving, the A button can start the game by giving the ball a velocity

def on_a_pressed():
    global list2, ballXSpeed
    if ballSprite.vx == 0:
        list2 = [50, -50]
        ballXSpeed = list2._pick_random()
        ballSprite.set_velocity(ballXSpeed, startingYSpeed * -1)
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

# When the ball overlaps with the paddle, set the velocity to make the ball go back up at the correct speed

def on_on_overlap(sprite, otherSprite):
    global ballXSpeed
    if ballSprite.y < paddleSprite.y - 1:
        # Include speed multiplier in both operations to make the ball move the correct speed based on the multiplier
        ballSprite.vy = startingYSpeed * (speedMultiplier * -1)
        ballSprite.vx = (ballSprite.x - paddleSprite.x) * 6 * speedMultiplier
        music.play(music.melody_playable(music.ba_ding),
            music.PlaybackMode.IN_BACKGROUND)
        # Update the X velocity variable to recall when the ball bounces off the side of a brick
        ballXSpeed = (ballSprite.x - paddleSprite.x) * 6 * speedMultiplier
sprites.on_overlap(SpriteKind.projectile, SpriteKind.player, on_on_overlap)

# Function to create grid of bricks
# Loop to create each row of bricks
def placeBricks(brickImg: Image, spriteWidth: number, spriteHeight: number):
    global cols, rows, brickAmount, brickSprite, i
    # Calculate amount of bricks that will fit
    cols = Math.floor(158 / spriteWidth)
    rows = Math.floor(50 / spriteHeight)
    brickAmount = cols * rows
    while i <= rows - 1:
        # Inner loop to create each column of bricks for every row
        j = 0
        while j <= cols - 1:
            # Create sprite
            brickSprite = sprites.create(brickImg, SpriteKind.enemy)
            # Place sprite in grid position using number of rows and columns completed as coordinates
            brickSprite.set_position(j * spriteWidth + brickGap * j + brickGap / 2,
                i * spriteHeight + brickGap * i + brickGap / 2)
            brickSprite.x += spriteWidth / 2
            brickSprite.y += 15
            j += 1
        i += 1
# Function to destroy bricks
def destroyBrick(brick: Sprite):
    sprites.destroy(brick, effects.ashes, 200)
    info.set_score(info.score() + 1)
    music.play(music.melody_playable(music.small_crash),
        music.PlaybackMode.IN_BACKGROUND)

def on_on_overlap2(sprite2, otherSprite2):
    if ballSprite.y >= otherSprite2.y + brickHeight / 2:
        print("down")
        ballSprite.vy = startingYSpeed * speedMultiplier
        destroyBrick(otherSprite2)
    elif ballSprite.y <= otherSprite2.y - brickHeight / 2:
        print("up")
        ballSprite.vy = startingYSpeed * speedMultiplier * -1
        destroyBrick(otherSprite2)
    elif ballSprite.x >= otherSprite2.x + brickWidth / 2:
        print("right")
        ballSprite.vx = ballXSpeed * -1
        destroyBrick(otherSprite2)
    elif ballSprite.x <= otherSprite2.x - brickWidth / 2:
        print("left")
        ballSprite.vx = ballXSpeed
        destroyBrick(otherSprite2)
sprites.on_overlap(SpriteKind.projectile, SpriteKind.enemy, on_on_overlap2)

brickSprite: Sprite = None
i = 0
rows = 0
cols = 0
list2: List[number] = []
ballXSpeed = 0
speedMultiplier = 0
startingYSpeed = 0
ballSprite: Sprite = None
paddleSprite: Sprite = None
brickAmount = 0
brickGap = 0
brickHeight = 0
brickWidth = 0
brickImg2 = assets.image("""
    brickImg
""")
brickGap = 2
brickAmount = 0
brickWidth = brickImg2.width
brickHeight = brickImg2.height
placeBricks(brickImg2, brickWidth, brickHeight)
defaultScoreTarget = brickAmount / 6
scene.set_background_color(9)
paddleSprite = sprites.create(assets.image("""
    paddleImg
"""), SpriteKind.player)
ballSprite = sprites.create(assets.image("""
    ballImg
"""), SpriteKind.projectile)
ballSprite.set_bounce_on_wall(True)
ballSprite.set_position(80, 100)
paddleSprite.set_position(80, 110)
controller.move_sprite(paddleSprite, 100, 0)
paddleSprite.set_stay_in_screen(True)
startingYSpeed = 50
speedMultiplier = 1
scoreTarget = defaultScoreTarget
info.set_life(3)
ballXSpeed = 0

def on_on_update():
    global speedMultiplier, scoreTarget
    if ballSprite.y > 115:
        if info.life() == 0:
            game.game_over(False)
            game.set_game_over_effect(False, effects.splatter)
            music.play(music.melody_playable(music.wawawawaa),
                music.PlaybackMode.IN_BACKGROUND)
        game.show_long_text("Life Lost!", DialogLayout.CENTER)
        info.change_life_by(-1)
        ballSprite.set_velocity(0, 0)
        ballSprite.set_position(80, 100)
        paddleSprite.set_position(80, 110)
        speedMultiplier = 1
        scoreTarget = info.score() + 8
        music.play(music.melody_playable(music.buzzer),
            music.PlaybackMode.IN_BACKGROUND)
    if info.score() >= scoreTarget:
        scoreTarget += defaultScoreTarget
        speedMultiplier += 0.2
        print(info.score())
    if info.score() >= brickAmount:
        game.game_over(True)
        game.set_game_over_effect(True, effects.confetti)
        music.play(music.melody_playable(music.power_up),
            music.PlaybackMode.IN_BACKGROUND)
game.on_update(on_on_update)
