// Game class for managing the game logic
class Game {
  constructor() {
    // Initialize game properties
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

  // Start the game
  start() {
    // Hide unnecessary elements and display game container
    this.hideElements([
      "game-container",
      "game-over-container",
      "game-win-container",
    ]);
    this.hideMenu();
    this.showElement("game-container");
    this.setup();
  }

  // Setup the game interval and keydown event listener
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
    }, 200);

    window.addEventListener("keydown", (evt) => {
      const direction = evt.key.replace("Arrow", "");
      this.dog.changeDirection(direction);
    });
  }

  // Hide menu elements
  hideMenu() {
    this.hideElements(["menu", "game-over-container", "game-win-container"]);
  }

  // Hide game elements and display game over container
  hideGame() {
    this.hideElements(["game-container"]);
    this.showElement("game-over-container");
  }

  // Display game win container
  winGame() {
    this.hideElements(["game-container"]);
    this.showElement("game-win-container");
  }

  // Hide specified HTML elements by their IDs
  hideElements(ids) {
    ids.forEach((id) => {
      document.getElementById(id).style.display = "none";
    });
  }

  // Display HTML element by its ID
  showElement(id) {
    document.getElementById(id).style.display = "block";
  }

  // End the game by clearing the interval and hiding the game
  endGame() {
    clearInterval(this.intervalId);
    this.hideGame();
  }
}

// Dog class for managing the player's dog
class Dog {
  constructor(game) {
    // Initialize dog properties
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

  // Draw the dog on the canvas
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

  // Update the dog's position and check for collisions
  update() {
    //Update position of thr tail, except last element
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    //Update last element's position with head position
    this.tail[this.total - 1] = { x: this.x, y: this.y };
    //Update head position
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Check if the dog goes out of bounds and reset the game
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

  // Change the direction of the dog based on the key pressed
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

  // Check if the dog picks up a stray dog and update the game state
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

  // Check for collisions with the dog's tail
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

  // Check if the player wins the game
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

    if (allInsideDogPark && this.total >= 7) {
      clearInterval(this.game.intervalId);
      this.game.winGame();
    }
  }

  // Reset the dog's properties
  reset() {
    this.total = 0;
    this.tail = [];
    this.collectedStrayDogs = [];
    this.x = 0;
    this.y = 0;
    this.x += this.xSpeed;
  }
}

// StrayDog class for managing stray dogs in the game
class StrayDog {
  constructor(game) {
    // Initialize stray dog properties
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

  // Draw the stray dog on the canvas
  draw() {
    this.game.ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.game.scale,
      this.game.scale
    );
  }

  // Pick a random location for the stray dog
  pickLocation() {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    this.image = new Image();
    this.image.src = this.images[randomIndex];

    // Ensure the stray dog does not appear inside the dog park
    do {
      this.x = Math.floor(Math.random() * this.game.rows) * this.game.scale;
      this.y = Math.floor(Math.random() * this.game.columns) * this.game.scale;
    } while (this.x >= 200 && this.x < 400 && this.y >= 200 && this.y < 400);
  }
}

// DogPark class for managing the dog park in the game
class DogPark {
  constructor(game) {
    // Initialize dog park properties
    this.game = game;
    this.image = new Image();
    this.image.src = "./assets/Field.png";
  }

  // Draw the dog park on the canvas
  draw() {
    this.game.ctx.drawImage(this.image, 200, 200, 200, 200);
  }
}

// Restart the game function
function restartGame() {
  window.location.reload();
}

// Create an instance of the Game class
const game = new Game();
