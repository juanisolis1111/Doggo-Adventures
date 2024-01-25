document.getElementById("game-container").style.display = "none";
document.getElementById("game-over-container").style.display = "none";
document.getElementById("game-win-container").style.display = "none";

function hideMenu() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("game-over-container").style.display = "none";
  document.getElementById("game-win-container").style.display = "none";
}

function hideGame() {
  document.getElementById("game-container").style.display = "none";
  document.getElementById("game-over-container").style.display = "block";
}

function winGame() {
  document.getElementById("game-container").style.display = "none";
  document.getElementById("game-win-container").style.display = "block";
}

let intervalId;

function checkWin(dog) {
  const dogAndStrayDogs = [dog, ...dog.tail];

  //   // Check if all elements are inside the dog park
  const allInsideDogPark = dogAndStrayDogs.every((element) => {
    return (
      element.x >= 200 && element.x < 400 && element.y >= 200 && element.y < 400
    );
  });

  if (allInsideDogPark) {
    clearInterval(intervalId); // Stop the game loop
    winGame(); // Win the game
  }
}

function playGame() {
  hideMenu();
  document.getElementById("game-container").style.display = "block";

  // Draw
  const canvas = document.querySelector("#dogGame");
  const ctx = canvas.getContext("2d");

  const scale = 40;
  const rows = canvas.height / scale;
  const columns = canvas.width / scale;

  // Setup
  function setup() {
    dog = new Dog();
    strayDog = new StrayDog();
    strayDog.pickLocation();
    dogPark = new DogPark();
    let beat = new Audio(
      "./assets/30966_playful-detective-music-sting-soundroll-1-00-34.mp3"
    );

    intervalId = window.setInterval(() => {
      checkWin(dog);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dogPark.draw();
      strayDog.draw();
      dog.update();
      dog.draw();
      beat.play();

      // Picks Up strayDog
      if (dog.picksUp(strayDog)) {
        strayDog.pickLocation();
      }

      document.querySelector(".dog-score").innerText = dog.total;
      if (dog.checkCollision()) {
        hideGame();
        clearInterval(intervalId); // Clear the interval on collision
      }
    }, 300);
  }

  // Key Listener
  window.addEventListener("keydown", (evt) => {
    const direction = evt.key.replace("Arrow", "");
    dog.changeDirection(direction);
  });

  // DogPlayer
  class Dog {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.xSpeed = scale;
      this.ySpeed = 0;
      this.total = 0;
      this.tail = [];
      this.collectedStrayDogs = [];

      // Draw DogPlayer
      this.draw = function () {
        this.image = new Image();
        this.image.src = "./assets/Dog2.png";

        for (let i = 0; i < this.collectedStrayDogs.length; i++) {
          ctx.drawImage(
            this.collectedStrayDogs[i].image,
            this.tail[i].x,
            this.tail[i].y,
            scale,
            scale
          );
        }

        ctx.drawImage(this.image, this.x, this.y, scale, scale);
      };
      console.log("total", this.total);
      // Update Collected Dog
      this.update = function () {
        for (let i = 0; i < this.tail.length - 1; i++) {
          this.tail[i] = this.tail[i + 1];
        }
        // Update Newly Pcikedup  Dog
        this.tail[this.total - 1] = { x: this.x, y: this.y };
        // Update Head  Dog
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x > canvas.width) {
          this.total = 0;
          this.tail = [];
          this.x = 0;
          this.y = 0;
          this.x += this.xSpeed;
          hideGame();
        }
        if (this.y > canvas.height) {
          this.total = 0;
          this.tail = [];
          this.x = 0;
          this.y = 0;
          this.x += this.xSpeed;
          hideGame();
        }
        if (this.x < 0) {
          this.total = 0;
          this.tail = [];
          this.x = 0;
          this.y = 0;
          this.x += this.xSpeed;
          hideGame();
        }
        if (this.y < 0) {
          this.total = 0;
          this.tail = [];
          this.x = 0;
          this.y = 0;
          this.x += this.xSpeed;
          hideGame();
        }
      };
      // Change Direction
      this.changeDirection = function (direction) {
        switch (direction) {
          case "Up":
            this.xSpeed = 0;
            this.ySpeed = -scale;
            break;
          case "Down":
            this.xSpeed = 0;
            this.ySpeed = scale;
            break;
          case "Left":
            this.xSpeed = -scale;
            this.ySpeed = 0;
            break;
          case "Right":
            this.xSpeed = scale;
            this.ySpeed = 0;
            break;
        }
      };
      // Picks Up strayDog
      this.picksUp = function (strayDog) {
        if (this.x === strayDog.x && this.y === strayDog.y) {
          //Declare stray dog and add to collectedStrayDogs
          const newStrayDog = new StrayDog();
          newStrayDog.x = strayDog.x;
          newStrayDog.y = strayDog.y;
          newStrayDog.image.src = strayDog.image.src; // Copy the image source
          this.collectedStrayDogs.push(newStrayDog);
          this.total++;
          return true;
        }
      };

      // Check Collision
      this.checkCollision = function () {
        for (let i = 0; i < this.tail.length; i++) {
          if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
            this.total = 0;
            this.tail = [];
            this.x = 0;
            this.y = 0;
            hideGame();
          }
        }
      };
    }
  }

  // Stray Dog
  class StrayDog {
    constructor() {
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
      ctx.drawImage(this.image, this.x, this.y, scale, scale);
    }

    pickLocation() {
      const randomIndex = Math.floor(Math.random() * this.images.length);
      this.image = new Image(); // Create a new Image object
      this.image.src = this.images[randomIndex];

      //Pick location outside dog park
      do {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
      } while (this.x >= 200 && this.x < 400 && this.y >= 200 && this.y < 400);
    }
  }

  class DogPark {
    constructor() {
      this.image = new Image();
      this.image.src = "./assets/Field.png";
    }

    draw() {
      ctx.drawImage(this.image, 200, 200, 200, 200);
    }
  }

  // Initial setup
  setup();
}
