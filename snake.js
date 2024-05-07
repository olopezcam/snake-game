// Snake.js

class Snake {
  constructor() {
    // Get the canvas and context
    this.canvas = document.getElementById("game");
    this.context = this.canvas.getContext("2d");
    // Initialize score
    this.score = 0;
    // Initialize fruit counter
    this.fruitCounter = 0;
    this.fruitThreshold = 3; // Change this to the number of fruits to eat before generating an obstacle
    // Initialize special fruit
    this.specialFruit = null;
    this.obstacleThreshold = 5; // Change this to the number of obstacles before generating a special fruit

    // Define the size of each square
    this.box = 32;

    // Initialize the snake at the center of the canvas
    this.snake = [{ x: 8 * this.box, y: 8 * this.box }];

    // Set the initial direction of the snake
    this.direction = "right";

    // Place the food at a random position
    this.food = {
      x: Math.floor(Math.random() * 15 + 1) * this.box,
      y: Math.floor(Math.random() * 15 + 1) * this.box,
    };

    // Initialize obstacles
    this.obstacles = [
      { x: 5 * this.box, y: 7 * this.box },
      { x: 8 * this.box, y: 12 * this.box },
      { x: 13 * this.box, y: 15 * this.box },
      // Add more obstacles as needed
    ];
  }

  // Draw the background
  createBG() {
    this.context.fillStyle = "lightgreen";
    this.context.fillRect(0, 0, 16 * this.box, 16 * this.box);
  }

  // Draw the snake
  createSnake() {
    for (let i = 0; i < this.snake.length; i++) {
      this.context.fillStyle = "green";
      this.context.fillRect(
        this.snake[i].x,
        this.snake[i].y,
        this.box,
        this.box
      );
    }
  }

  // Draw the food
  drawFood() {
    this.context.fillStyle = "red";
    this.context.fillRect(this.food.x, this.food.y, this.box, this.box);
    // Draw the special fruit
    if (this.specialFruit) {
      this.context.fillStyle = "yellow";
      this.context.fillRect(
        this.specialFruit.x,
        this.specialFruit.y,
        this.box,
        this.box
      );
    }
  }

  // Draw the obstacles
  drawObstacles() {
    this.context.fillStyle = "grey";
    this.obstacles.forEach((obstacle) => {
      this.context.fillRect(obstacle.x, obstacle.y, this.box, this.box);
    });
  }

  // Generate an obstacle at a random position
  generateObstacle() {
    this.obstacles.push({
      x: Math.floor(Math.random() * 15 + 1) * this.box,
      y: Math.floor(Math.random() * 15 + 1) * this.box,
    });
  }

  // Update the direction based on the key pressed
  update(event) {
    if (event.keyCode == 37 && this.direction != "right")
      this.direction = "left";
    if (event.keyCode == 38 && this.direction != "down") this.direction = "up";
    if (event.keyCode == 39 && this.direction != "left")
      this.direction = "right";
    if (event.keyCode == 40 && this.direction != "up") this.direction = "down";
  }

  // The main game loop
  startGame() {
    // Wrap the snake around to the other side of the canvas
    if (this.snake[0].x >= 16 * this.box && this.direction == "right")
      this.snake[0].x = 0;
    if (this.snake[0].x < 0 && this.direction == "left")
      this.snake[0].x = 15 * this.box;
    if (this.snake[0].y >= 16 * this.box && this.direction == "down")
      this.snake[0].y = 0;
    if (this.snake[0].y < 0 && this.direction == "up")
      this.snake[0].y = 15 * this.box;

    // Check if the snake has collided with itself
    for (let i = 1; i < this.snake.length; i++) {
      if (
        this.snake[0].x == this.snake[i].x &&
        this.snake[0].y == this.snake[i].y
      ) {
        clearInterval(this.game);
        alert("Game Over :(");
      }
    }

    // Check if the snake has collided with an obstacle
    for (let obstacle of this.obstacles) {
      if (this.snake[0].x == obstacle.x && this.snake[0].y == obstacle.y) {
        clearInterval(this.game);
        alert("Game Over :(");
      }
    }

    // Draw the game objects
    this.createBG();
    this.createSnake();
    this.drawFood();
    this.drawObstacles();

    // Move the snake
    let snakeX = this.snake[0].x;
    let snakeY = this.snake[0].y;

    if (this.direction == "right") snakeX += this.box;
    if (this.direction == "left") snakeX -= this.box;
    if (this.direction == "up") snakeY -= this.box;
    if (this.direction == "down") snakeY += this.box;

    // Check if the snake has eaten the food
    if (snakeX != this.food.x || snakeY != this.food.y) {
      // Remove the tail of the snake
      this.snake.pop();
    } else {
      // Increase the score
      this.score++;
      // Increase the fruit counter
      this.fruitCounter++;

      // Check if the fruit counter has reached the threshold
      if (this.fruitCounter >= this.fruitThreshold) {
        // Generate a new obstacle
        this.generateObstacle();

        // Reset the fruit counter
        this.fruitCounter = 0;

        // Decrease the fruit threshold to make obstacles appear more frequently
        if (this.fruitThreshold > 1) {
          this.fruitThreshold--;
        }
      }

      // Update the score display
      document.getElementById("score").innerText = "Score: " + this.score;

      // Generate a new food position
      this.food.x = Math.floor(Math.random() * 15 + 1) * this.box;
      this.food.y = Math.floor(Math.random() * 15 + 1) * this.box;

      if (this.obstacles.length >= this.obstacleThreshold) {
        // Generate a special fruit
        this.specialFruit = {
          x: Math.floor(Math.random() * 15 + 1) * this.box,
          y: Math.floor(Math.random() * 15 + 1) * this.box,
        };
      }
    }

    // Check if the snake has eaten the special fruit
    if (
      this.specialFruit &&
      snakeX == this.specialFruit.x &&
      snakeY == this.specialFruit.y
    ) {
      // Remove half of the obstacles
      this.obstacles.splice(0, Math.floor(this.obstacles.length / 2));

      // Remove the special fruit
      this.specialFruit = null;
    }

    // Add a new head to the snake
    let newHead = {
      x: snakeX,
      y: snakeY,
    };

    this.snake.unshift(newHead);
  }

  // Start the game
  run() {
    document.addEventListener("keydown", (event) => this.update(event));
    if (this.game) {
      clearInterval(this.game);
    }
    this.game = setInterval(() => this.startGame(), 100);
  }
}

// index.js

function restartGame() {
  // Create a new instance of the Snake game
  snakeGame = new Snake();
  snakeGame.run();
}

// Create a new Snake game and start it
let snakeGame = new Snake();
snakeGame.run();
