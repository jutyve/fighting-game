const canvas = document.querySelector("canvas");
const c=canvas.getContext("2d");
canvas.width=1024
canvas.height=576
c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 7

class Sprite{
    constructor({position,velocity,color,offset}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.lastKey
        this.width = 50
        this.air
        this.isattacking = false
        this.color=color
        this.health = 100
        this.hitbox = {
            position:{
              x: this.position.x ,
              y: this.position.y
            },
            width:100,
            height:50,
            offset:offset
          }
        }
    
    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
         
        //attack
        if(this.isattacking===true){
          c.fillStyle = "green"
          c.fillRect(this.hitbox.position.x,this.hitbox.position.y,this.hitbox.width,this.hitbox.height)
      }
  }
    update(){
        this.draw()
        this.hitbox.position.x = this.position.x - this.hitbox.offset.x
        this.hitbox.position.y = this.position.y
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
            this.air = false
      } else {
        this.position.y += gravity
        this.air = true
    }
  }
    attacking(){
      this.isattacking = true
      setTimeout(() => {
        this.isattacking = false
      }, 200)
    }


}

const player = new Sprite({
    position: {
        x:100,
        y:0
    },
    velocity: {
        x:0,
        y:10
    },
    color:"red",
    offset: {
      x:0,
      y:0
  },
})

const enemy = new Sprite({
    position: {
        x:850,
        y:100
    },
    velocity: {
        x:0,
        y:10
    },
    color:"blue",
    offset: {
      x:50,
      y:0
  },
})


const keys = {
    a: {
      pressed: false
    },
    d: {
      pressed: false
    },
// enemy stuff
    ArrowRight : {
        pressed: false
    },
    ArrowLeft : {
        pressed: false
}   }

let lastKey

//timer BABY!!!

let timer = 60
let timerid

function lowertime() {
  if (timer > 0){
    timerid = setTimeout(lowertime,1000)
    timer --
    document.querySelector("#timer").innerHTML = timer
  }
  
  if(timer===0){
    document.querySelector("#displayText").style.display = "flex"
    if (player.health === enemy.health){
      document.querySelector("#displayText").innerHTML = "Tie"
    }else if(player.health > enemy.health){
      //only gigachads will read this
      document.querySelector("#displayText").innerHTML = "Player 1 Won"
    }else if(player.health < enemy.health){
      document.querySelector("#displayText").innerHTML = "Player 2 Won"
      
    }
  } 
}
lowertime()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle="black"
    c.fillRect(0,0,canvas.width,canvas.height)
    enemy.update()
    player.update()

    // player movement

    player.velocity.x=0
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
      } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    } 
    
    //enemy movement

    enemy.velocity.x=0
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
      enemy.velocity.x = 5
    } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      enemy.velocity.x = -5
    }

    //hitbox for player POG

    if (player.hitbox.position.x + player.hitbox.width >= enemy.position.x &&
       player.hitbox.position.x <= enemy.position.x + enemy.width &&
        player.hitbox.position.y + player.hitbox.height >= enemy.hitbox.position.y &&
        player.hitbox.position.y <= enemy.position.y + enemy.height &&
        player.isattacking===true) {
          player.isattacking = false
          enemy.health -= 20
          document.querySelector("#enemyHealth").style.width = enemy.health + "%"
    }

    //end game (im happy beacause im close to finishing this)

    if (player.health === 0){
      clearTimeout(timerid)
      document.querySelector("#displayText").style.display = "flex"
      document.querySelector("#displayText").innerHTML = "Player 2 Won"
    }else if (enemy.health === 0){
      clearTimeout(timerid)
      document.querySelector("#displayText").style.display = "flex"
      document.querySelector("#displayText").innerHTML = "Player 1 Won"
    }
    //hitbox for enemy sadge

        if (enemy.hitbox.position.x + enemy.hitbox.width >= player.position.x &&
       enemy.hitbox.position.x <= player.position.x + player.width &&
        enemy.hitbox.position.y + enemy.hitbox.height >= player.hitbox.position.y &&
        enemy.hitbox.position.y <= player.position.y + player.height &&
        enemy.isattacking===true) {
          enemy.isattacking = false
          player.health -= 20
          document.querySelector("#playerHealth").style.width = player.health + "%"
    }
}
animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        if (player.air === false){
            player.position.y -= 170
        }
        break
        case 's':
          player.attacking()
          break

       // enemy stuff here btw

      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case "ArrowUp":
        if (enemy.air === false){
            enemy.position.y -= 170
        }
      case 'ArrowDown':
        enemy.attacking()
        break
    }
  }
)

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
        keys.a.pressed = false
        break
// enemy stuff here btw
    case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
    case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
  }
})