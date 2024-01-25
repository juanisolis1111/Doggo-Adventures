## Welcome to Doggo Adventures!

This simple browser-based game allows you to control a dog and collect stray dogs within a designated dog park. Your goal is to collect a certain number of stray dogs without colliding with the boundaries or your own tail.

## How to Play

1.  Press the "Start Game" button to begin.
2.  Use the arrow keys (`Up`, `Down`, `Left`, `Right`) to control the direction of your dog.
3.  Collect stray dogs within the dog park by moving your dog over them.
4.  Avoid colliding with the boundaries or your own tail.
5.  Collect enough stray dogs to win the game.

## Code Overview

### `Game` Class

The `Game` class manages the overall game logic, including initialization, starting, setup, and ending of the game. It also handles hiding and displaying game elements, such as the menu, game container, game over container, and game win container.

### `Dog` Class

The `Dog` class represents the player-controlled dog. It manages the dog's position, movement, drawing on the canvas, and interactions with stray dogs. The player wins the game by collecting a specified number of stray dogs within the dog park.

### `StrayDog` Class

The `StrayDog` class handles the properties and behavior of stray dogs in the game. Stray dogs are randomly positioned on the canvas, and the player's goal is to collect them.

### `DogPark` Class

The `DogPark` class represents the dog park area within the game. It is responsible for drawing the dog park on the canvas.

### Functions

- `hideElements(ids)`: Hides specified HTML elements by their IDs.
- `showElement(id)`: Displays an HTML element by its ID.
- `restartGame()`: Restarts the game by reloading the window.

## Game Assets

- Dog images: `Dog1.png`, `Dog2.png`, `Dog3.png`, `Dog4.png`
- Dog park image: `Field.png`
- Background music: `playful-detective-music-sting-soundroll-1-00-34.mp3`

## Credits

Background music: [Soundroll](https://chat.openai.com/c/assets/30966_playful-detective-music-sting-soundroll-1-00-34.mp3)

Dog Pixel Art: [Pngtree](https://pngtree.com/)

Enjoy playing the Dog Game! If you encounter any issues or have suggestions, feel free to contribute or contact the developer.
