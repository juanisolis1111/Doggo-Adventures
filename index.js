class Game {
  constructor() {
    this.intervalId = null;
    this.canvas = document.querySelector("#dogGame");
    this.ctx = this.canvas.getContext("2d");
    this.scale = 40;
    this.rows = this.canvas.height / this.scale;
    this.columns = this.canvas.width / this.scale;
    this.dog = new Dog(this);
    this.strayDog = new StrayDog(this);
    this.dogPark = new DogPark(this);
    this.audio = new Audio(
      "./assets/30966_playful-detective-music-sting-soundroll-1-00-34.mp3"
    );
  }

  start() {
    this.hideElements([
      "game-container",
      "game-over-container",
      "game-win-container",
    ]);
    this.hideMenu();
    this.showElement("game-container");
    this.setup();
  }

  setup() {
    this.intervalId = window.setInterval(() => {
      this.dog.checkWin();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.dogPark.draw();
      this.strayDog.draw();
      this.dog.update();
      this.dog.draw();
      this.audio.play();

      if (this.dog.picksUp(this.strayDog)) {
        this.strayDog.pickLocation();
      }

      document.querySelector(".dog-score").innerText = this.dog.total;
      if (this.dog.checkCollision()) {
        this.endGame();
      }
    }, 300);

    window.addEventListener("keydown", (evt) => {
      const direction = evt.key.replace("Arrow", "");
      this.dog.changeDirection(direction);
    });
  }

  hideMenu() {
    this.hideElements(["menu", "game-over-container", "game-win-container"]);
  }

  hideGame() {
    this.hideElements(["game-container"]);
    this.showElement("game-over-container");
  }

  winGame() {
    this.hideElements(["game-container"]);
    this.showElement("game-win-container");
  }

  hideElements(ids) {
    ids.forEach((id) => {
      document.getElementById(id).style.display = "none";
    });
  }

  showElement(id) {
    document.getElementById(id).style.display = "block";
  }

  endGame() {
    clearInterval(this.intervalId);
    this.hideGame();
  }
}

class Dog {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.xSpeed = game.scale;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];
    this.collectedStrayDogs = [];
    this.image = new Image();
    this.image.src = "./assets/Dog2.png";
  }

  draw() {
    for (let i = 0; i < this.collectedStrayDogs.length; i++) {
      this.game.ctx.drawImage(
        this.collectedStrayDogs[i].image,
        this.tail[i].x,
        this.tail[i].y,
        this.game.scale,
        this.game.scale
      );
    }

    this.game.ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.game.scale,
      this.game.scale
    );
  }

  update() {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    this.tail[this.total - 1] = { x: this.x, y: this.y };

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (
      this.x > this.game.canvas.width ||
      this.y > this.game.canvas.height ||
      this.x < 0 ||
      this.y < 0
    ) {
      this.reset();
      this.game.hideGame();
    }
  }

  changeDirection(direction) {
    switch (direction) {
      case "Up":
        this.xSpeed = 0;
        this.ySpeed = -this.game.scale;
        break;
      case "Down":
        this.xSpeed = 0;
        this.ySpeed = this.game.scale;
        break;
      case "Left":
        this.xSpeed = -this.game.scale;
        this.ySpeed = 0;
        break;
      case "Right":
        this.xSpeed = this.game.scale;
        this.ySpeed = 0;
        break;
    }
  }

  picksUp(strayDog) {
    if (this.x === strayDog.x && this.y === strayDog.y) {
      const newStrayDog = new StrayDog(this.game);
      newStrayDog.x = strayDog.x;
      newStrayDog.y = strayDog.y;
      newStrayDog.image.src = strayDog.image.src;
      this.collectedStrayDogs.push(newStrayDog);
      this.total++;
      return true;
    }
  }

  checkCollision() {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        this.reset();
        this.game.hideGame();
        return true;
      }
    }
    return false;
  }

  checkWin() {
    const dogAndStrayDogs = [this, ...this.tail];
    const allInsideDogPark = dogAndStrayDogs.every((element) => {
      return (
        element.x >= 200 &&
        element.x < 400 &&
        element.y >= 200 &&
        element.y < 400
      );
    });

    if (allInsideDogPark) {
      clearInterval(this.game.intervalId);
      this.game.winGame();
    }
  }

  reset() {
    this.total = 0;
    this.tail = [];
    this.x = 0;
    this.y = 0;
    this.x += this.xSpeed;
  }
}

class StrayDog {
  constructor(game) {
    this.game = game;
    this.x;
    this.y;
    this.images = [
      "./assets/Dog1.png",
      "./assets/Dog2.png",
      "./assets/Dog3.png",
      "./assets/Dog4.png",
    ];
    this.image = new Image();
    this.pickLocation();
  }

  draw() {
    this.game.ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.game.scale,
      this.game.scale
    );
  }

  pickLocation() {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    this.image = new Image();
    this.image.src = this.images[randomIndex];

    do {
      this.x = Math.floor(Math.random() * this.game.rows) * this.game.scale;
      this.y = Math.floor(Math.random() * this.game.columns) * this.game.scale;
    } while (this.x >= 200 && this.x < 400 && this.y >= 200 && this.y < 400);
  }
}

class DogPark {
  constructor(game) {
    this.game = game;
    this.image = new Image();
    this.image.src = "./assets/Field.png";
  }

  draw() {
    this.game.ctx.drawImage(this.image, 200, 200, 200, 200);
  }
}

function restartGame() {
  window.location.reload();
}

const game = new Game();
