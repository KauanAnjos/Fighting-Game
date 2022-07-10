function rectangularCullision({ rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector("#displayText").style.display = "flex"
    if (player.vida === enemy.vida) {
        document.querySelector("#displayText").innerHTML = "Tie"
    } else if (player.vida > enemy.vida) {
        document.querySelector("#displayText").innerHTML = "Jogador Venceu"
    } else if (enemy.vida > player.vida) {
        document.querySelector("#displayText").innerHTML = "Inimigo Venceu"
    }
}

let timer = 60
let timerId
function decreseTimer() {
    if (timer > 0) {
        timerId = setTimeout (decreseTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({player, enemy})
    }   
}