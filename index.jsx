import React, { Component } from 'react';
import './sneek.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };

    // bind functions
    this.init = this.init.bind(this);
    this.bodySnake = this.bodySnake.bind(this);
    this.pizza = this.pizza.bind(this);
    this.scoreText = this.scoreText.bind(this);
    this.drawSnake = this.drawSnake.bind(this);
    this.createFood = this.createFood.bind(this);
    this.checkCollision = this.checkCollision.bind(this);
    this.paint = this.paint.bind(this);
  }
  
  componentDidMount() {
    const mycanvas = document.getElementById('canvas');
    this.ctx = mycanvas.getContext('2d');
    this.snakeSize = 10; 
    this.w = 500;
    this.h = 500;
    this.snake = null;
    this.snakeSize = 10;
    this.food = null;
    this.direction = 'down';
    this.gameStarted = false;
    this.gameStatusText = document.getElementById('status-message');    
  }

  onLeftKeyPress() {
    if (this.direction !== 'right') {
      this.direction = 'left';
    }
  }

  onRightKeyPress() {
    if (this.direction !== 'left') {
      this.direction = 'right';
    }   
  }

  onUpKeyPress() {
    if (this.direction !== 'down') {
      this.direction = 'up';
    }   
  }

  onDownKeyPress() {
    if (this.direction !== 'up') {
      this.direction = 'down';
    }
  }

  onEnterKeyPress() {
    if (!this.gameStarted) {
      this.init();
    }
  }
  
  init() {
    this.drawSnake();
    this.createFood();
    this.gameloop = setInterval(this.paint, 80);
    this.direction = 'down';
    this.score = 0;    

    // hide status text
    this.gameStatusText.style = 'display:none;';
    this.gameStarted = true;
  }
  
  bodySnake(x, y) {
    const snakeSize = this.snakeSize;
    // This is the single square
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
    // This is the border of the square
    this.ctx.strokeStyle = 'darkgreen';
    this.ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
  }
  
  pizza(x, y) {
    const snakeSize = this.snakeSize;
    
    // This is the border of the pizza
    this.ctx.fillStyle = 'yellow';
    this.ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
    // This is the single square 
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(x*snakeSize+1, y*snakeSize+1, snakeSize-2, snakeSize-2);
  }
  
  scoreText() {
    // How many pizzas did the snake eat
    const score_text = "Score: " + this.score;
    this.ctx.fillStyle = 'blue';
    this.ctx.font = "30px Arial";    
    this.ctx.fillText(score_text, 210, this.h - 5);
  }
  
  drawSnake() {
    // Initially the body of the snake will be formed by 5 squares.
    const length = 4;
    this.snake = [];
    
    // Using a for loop we push the 5 elements inside the array(squares).
    // Every element will have x = 0 and the y will take the value of the index.
    for (let i = length; i >= 0; i -= 1) {
      this.snake.push({ x: i, y: 0 });
    }  
  }
  
  createFood() {
    this.food = {
      // Generate random numbers.
      x: Math.floor((Math.random() * 30) + 1),
      y: Math.floor((Math.random() * 30) + 1),
    };
    
    // Look at the position of the snake's body.
    for (let i = 0; i < this.snake.length; i += 1) {
      const snakeX = this.snake[i].x;
      const snakeY = this.snake[i].y;
      
      if (this.food.x === snakeX || this.food.y === snakeY || this.food.y === snakeY && this.food.x === snakeX) {
        this.food.x = Math.floor((Math.random() * 30) + 1);
        this.food.y = Math.floor((Math.random() * 30) + 1);
      }
    }
  }
  
  checkCollision(x, y, array) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].x === x && array[i].y === y) {
        return true;   
      }
    } 
    return false;
  }
  
  paint() {
    // Let's draw the space in which the snake will move.
    this.ctx.fillStyle = 'lightgrey';
    this.ctx.fillRect(0, 0, this.w, this.h);
    
    // Give it a border.
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, this.w, this.h);
    
    let snakeX = this.snake[0].x;
    let snakeY = this.snake[0].y;    
    
    /*
    Make the snake move.
    Use a variable ('direction') to control the movement.
    To move the snake, pop out the last element of the array and shift it on the top as first element.
    */
    if (this.direction === 'right') {
      snakeX += 1;
    } else if (this.direction === 'left') {
      snakeX -= 1;
    } else if (this.direction === 'up') {
      snakeY -= 1;
    } else if (this.direction === 'down') {
      snakeY += 1;
    }
    
    /*
    If the snake touches the canvas path or itself, it will die!
    Therefore if x or y of an element of the snake, don't fit inside the canvas, the game will be stopped.
    If the check_collision is true, it means the the snake has crashed on its body itself, then the game will be stopped again. 
    */
    if (snakeX === -1 || snakeX === this.w / this.snakeSize || snakeY === -1 || snakeY === this.h / this.snakeSize || this.checkCollision(snakeX, snakeY, this.snake)) {
      // Stop the game.
      if (this.gameStarted) {
        this.gameStarted = false;
      }
      
      // Clean up the canvas.
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.gameloop = clearInterval(this.gameloop);

      // Show game status text.
      this.gameStatusText.style = 'display:block;';
      this.gameStatusText.innerHTML = "Game Over! Press 'Ok' to restart.";     
      return;
    }
    
    let tail = null;
    
    // If the snake eats food it becomes longer and this means that, in this case, you shouldn't pop out the last element of the array.
    if (snakeX === this.food.x && snakeY === this.food.y) {
      // Create a new square insteead of moving the tail.
      tail = {
        x: snakeX,
        y: snakeY,
      };
      this.score += 1;
      
      // Create new food.
      this.createFood();
    } else {
      // Pop out the last cell.
      tail = this.snake.pop();
      tail.x = snakeX;
      tail.y = snakeY;
    }
    
    // Puts the tail as the first cell.
    this.snake.unshift(tail);
    
    // For each element of the array create a square using the bodySnake function we created before.
    for (let i = 0; i < this.snake.length; i += 1) {
      this.bodySnake(this.snake[i].x, this.snake[i].y);
    }
    
    // Create food using the _pizza_ function.
    this.pizza(this.food.x, this.food.y);
    
    // Put the score text.
    this.scoreText();
  }
  
  render() {
    return (
      <div className="sneek">
        <h1>Sneek</h1>
        <p id="status-message">Press 'Ok' to start the game</p>        
        <canvas id="canvas" /> 
      </div>
    );
  }
}

export default App;
