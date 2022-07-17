const canvas = document.getElementById('canvas')
const context = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./assets/background.png"
})

const shop = new Sprite({
    position: {
        x: 620,
        y: 128
    },
    imageSrc: "./assets/shop.png",
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
    x: 200,
    y: 0
    },
    velocity:  {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./assets/pessonagens/Samurai/Sprites/Idle.png",
    scale: 2.5,
    framesMax: 8,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
      idle: {
        imageSrc: "./assets/pessonagens/Samurai/Sprites/Idle.png",
        framesMax: 8
      },
      run: {
        imageSrc: "./assets/pessonagens/Samurai/Sprites/Run.png",
        framesMax: 8
      },
      jump: {
        imageSrc: "./assets/pessonagens/Samurai/Sprites/Jump.png",
        framesMax: 2
      },
      fall: {
        imageSrc: "./assets/pessonagens/Samurai/Sprites/Fall.png",
        framesMax: 2
      },
      attack1: {
        imageSrc: "./assets/pessonagens/Samurai/Sprites/Attack1.png",
        framesMax: 6
      },
      takeHit: {
          imageSrc: "./assets/pessonagens/Samurai/Sprites/Take Hit.png",
          framesMax: 4
      },
      death: {
        imageSrc: "./assets/pessonagens/Samurai/Sprites/Death.png",
        framesMax: 6
      }
    },
    attackBox: {
        offset: {
            x: 50,
            y: 40
        },
        width: 207,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
    x: 800,
    y: 0
    },
    velocity:  {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: "./assets/pessonagens/Ladrao/Sprite/Idle.png",
    scale: 2.5,
    framesMax: 10,
    offset: {
        x: 140,
        y: 50,
    },
    sprites: {
      idle: {
        imageSrc: "./assets/pessonagens/Ladrao/Sprite/Idle.png",
        framesMax: 10
      },
      run: {
        imageSrc: "./assets/pessonagens/Ladrao/Sprite/Run.png",
        framesMax: 8
      },
      jump: {
        imageSrc: "./assets/pessonagens/Ladrao/Sprite/Going Up.png",
        framesMax: 3
      },
      fall: {
        imageSrc: "./assets/pessonagens/Ladrao/Sprite/Going Down.png",
        framesMax: 3
      },
      attack1: {
        imageSrc: "./assets/pessonagens/Ladrao/Sprite/Attack1.png",
        framesMax: 7
      },
      takeHit: {
        imageSrc: "./assets/pessonagens/Ladrao/Sprite/Take Hit.png",
        framesMax: 3
      },
      death: {
        imageSrc: "./assets/pessonagens/Ladrao/Sprite/Death.png",
        framesMax: 11
      }
    },
    attackBox: {
        offset: {
            x: 38,
            y: 55
        },
        width: 135,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },

    w: {
        pressed: false
    },

    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },

    ArrowUp: {
        pressed: false
    }
}

decreseTimer() 

function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = "black"
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

//========== Movimetos do Jogador ========== 

    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5
        player.switchSprite("run")
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5
        player.switchSprite("run")
    } else {
        player.switchSprite("idle")
    }

//==========Pulando Jogador========== 

    if (player.velocity.y < 0) {
        player.switchSprite("jump")
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall")
    }

//========== Movimetos do Inimigo ==========

    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5
        enemy.switchSprite("run")
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5
        enemy.switchSprite("run")
    } else {
        enemy.switchSprite("idle")
    }

//==========Pulando Inimigo ========== 

if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump")
} else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall")
}

//========== Detectar colição do Jogador e receber um hit ==========

    if (rectangularCullision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
            player.isAttacking && player.frameCurrent === 4) {
                enemy.takeHit()
                player.isAttacking = false

                document.querySelector("#vida-inimigo").style.width = enemy.vida + "%"
    }

    //========== Se o jogador errar ==========
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }
    
//========== Detectar colição do Inimigo e receber um hit ==========
    if (rectangularCullision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
            enemy.isAttacking && enemy.frameCurrent === 5) {
                player.takeHit()
                enemy.isAttacking = false
                document.querySelector("#vida-jogador").style.width = player.vida + "%"
    }

    //========== Se o inimigo errar ==========
    if (enemy.isAttacking && enemy.frameCurrent === 5) {
        enemy.isAttacking = false
    }

    //========== Fim de jogo com base na vida ==========
    if (enemy.vida <= 0 || player.vida <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener("keydown", (event) => {
    if (!player.dead) {
        switch (event.key) {
            case "d":
                keys.d.pressed = true
                player.lastKey = "d"
                break

            case "a":
                keys.a.pressed = true
                player.lastKey = "a"
                break

            case "w":
                player.velocity.y = -20
                break

            case "s":
                player.attack()
                break
        }
    }
    
    if (!enemy.dead) {
        switch(event.key) {
            case "ArrowRight":
                keys.ArrowRight.pressed = true
                enemy.lastKey = "ArrowRight"
                break
        
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true
                enemy.lastKey = "ArrowLeft"
                break

            case "ArrowUp":
                enemy.velocity.y = -20
                break

            case "ArrowDown":
                enemy.attack()
                break
        }
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false
            break

        case "a":
            keys.a.pressed = false
            break

        case "w":
            keys.w.pressed = false
            break

        case "ArrowRight":
            keys.ArrowRight.pressed = false
            break

        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break

        case "ArrowUp":
            keys.ArrowUp.pressed = false
            break
    }
})