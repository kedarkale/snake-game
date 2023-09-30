import { Component, HostListener, OnInit } from '@angular/core';

export enum Directions {
  UP,
  RIGHT,
  DOWN,
  LEFT
}

@Component({
  selector: 'app-game',
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"]
})

export class GameComponent implements OnInit {
  enableDebugMode = false;
  DIRECTIONS = Directions;
  BOARD_SIZE: number = 10;
  tempArray: Array<number> = Array(this.BOARD_SIZE);
  GRID = Array(this.BOARD_SIZE*this.BOARD_SIZE).fill(1).map((x, i) => { return {
      id: i,
      isSnake: false,
      isSnakeHead: false,
      isSnakeTail: false,
      isFood: false,
      movingIn: Directions.RIGHT
    }
  });
  gameStarted: boolean = false;
  currentDirection = Directions.RIGHT;
  gameLoopInterval = setInterval(() => {}, 0);
  Score = 0

  @HostListener("document:keypress", ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {    
    if (this.gameStarted) {
      switch(event.key) {
        case 'w':
        case 'W':
          this.changeDirection(Directions.UP);
          break;
        case 'a':
        case 'A':
          this.changeDirection(Directions.LEFT);
          break;
        case 's':
        case 'S':
          this.changeDirection(Directions.DOWN);
          break;
        case 'd':
        case 'D':
          this.changeDirection(Directions.RIGHT);
          break;
      }
    }
    else if (!this.gameStarted && event.key == ' ') {
      this.startGame();
    }
  }

  ngOnInit() {
    this.setStartState();
  }

  setStartState() {
    clearInterval(this.gameLoopInterval);
    this.GRID = Array(this.BOARD_SIZE*this.BOARD_SIZE).fill(1).map((x, i) => { return {
      id: i,
      isSnake: false,
      isSnakeHead: false,
      isSnakeTail: false,
      isFood: false,      
      movingIn: Directions.RIGHT
    }});
    this.Score = 0
    this.gameStarted = false;
    this.currentDirection = Directions.RIGHT;
    this.GRID[3].isSnake = true;
    this.GRID[3].isSnakeHead = true;
    this.GRID[2].isSnake = true;
    this.GRID[1].isSnake = true;
    this.GRID[0].isSnake = true;
    this.GRID[0].isSnakeTail = true;
    this.addFoodToRandomCell();
  }

  startGame() {
    this.gameStarted = true;
    // game loop
    this.gameLoopInterval = setInterval(() => {
      if (!this.checkCollision()) {
        this.moveSnake();
      }
    }, 300)
  }

  moveSnake() {
    let tempGrid = Array(this.BOARD_SIZE*this.BOARD_SIZE).fill(1).map((x, i) => { return {
      id: i,
      isSnake: false,
      isSnakeHead: false,
      isSnakeTail: false,
      isFood: false,      
      movingIn: Directions.RIGHT
    }});
    let isFoodToBeConsumed = false;

    this.GRID.forEach((cell, index) => {
      if (cell.isSnake) {
        let nextCellIndex = this.getNextCellIndex(index, cell.movingIn);
        isFoodToBeConsumed = isFoodToBeConsumed || (cell.isSnakeHead && this.GRID[nextCellIndex].isFood);
        tempGrid[nextCellIndex].movingIn = cell.isSnakeHead ? cell.movingIn : this.GRID[nextCellIndex].movingIn;
        tempGrid[nextCellIndex].isSnake = true;
        tempGrid[nextCellIndex].isSnakeHead = cell.isSnakeHead;
        tempGrid[nextCellIndex].isSnakeTail = cell.isSnakeTail;

        if (cell.isSnakeTail) tempGrid[index].isSnake = false;
        tempGrid[index].isSnakeHead = false;
        tempGrid[index].isSnakeTail = false;
      }
      
    });
    if (isFoodToBeConsumed) {
      this.consumeFood();
      // todo - increase length here?
    }
    tempGrid[this.getFoodCellIndex()].isFood = true;
    
    this.GRID = JSON.parse(JSON.stringify(tempGrid));
  }

  addFoodToRandomCell() {
    if (this.GRID.some(c => c.isFood == true)) return;
  
    let foodAdded = false;
    while (!foodAdded) {
      let randomCell = Math.floor(Math.random()*this.BOARD_SIZE*this.BOARD_SIZE);
      if (!this.GRID[randomCell].isSnake) {
        this.GRID[randomCell].isFood = true;
        foodAdded = true;
      }
    }
  }

  consumeFood() {
    // todo - increase length and maintain score
    this.Score++;
    this.GRID[this.getFoodCellIndex()].isFood = false;
    this.addFoodToRandomCell();
  }

  checkCollision(): boolean {
    let headIndex = this.getSnakeHeadIndex();
    let nextMoveIndex = this.getNextCellIndex(headIndex, this.GRID[headIndex].movingIn)
    // out of board
    if (
      nextMoveIndex < 0 ||
      nextMoveIndex >= this.BOARD_SIZE*this.BOARD_SIZE ||
      (headIndex%this.BOARD_SIZE == this.BOARD_SIZE-1 && nextMoveIndex%this.BOARD_SIZE == 0) ||
      (nextMoveIndex%this.BOARD_SIZE == this.BOARD_SIZE-1 && headIndex%this.BOARD_SIZE == 0)
    ) {
      alert(`Collision! Game Over! Your Score was ${this.Score}`);
      this.setStartState();
      return true;
    }
    // collision with self
    if (this.GRID[nextMoveIndex].isSnake) {
      alert(`Collision with self! Game Over! Your Score was ${this.Score}`);
      this.setStartState();
      return true;
    }
    return false;
  }

  getNextCellIndex(currentCellIndex: number, direction: Directions): number {
    let nextCellIndex = 0;
    switch(direction) {
      case Directions.RIGHT:
        nextCellIndex = currentCellIndex + 1;
        break;
      case Directions.DOWN:
        nextCellIndex = currentCellIndex + this.BOARD_SIZE;
        break;
      case Directions.LEFT:
        nextCellIndex = currentCellIndex - 1;
        break;
      case Directions.UP:
        nextCellIndex = currentCellIndex - this.BOARD_SIZE;
        break;
    }
    return nextCellIndex;
  }

  restartGame() {
    this.setStartState();
  }

  changeDirection(direction: Directions) {
    // invalid moves
    let leftRightConflict = [Directions.LEFT, Directions.RIGHT];
    let upDownConflict = [Directions.UP, Directions.DOWN];
    if ((leftRightConflict.includes(direction) && leftRightConflict.includes(this.currentDirection)) ||
      (upDownConflict.includes(direction) && upDownConflict.includes(this.currentDirection))
    ) {
      console.error("invalid direction input!");
      return;
    }

    this.currentDirection = direction;
    this.GRID[this.getSnakeHeadIndex()].movingIn = this.currentDirection;
  }

  getSnakeHeadIndex(): number {
    let val = this.GRID.findIndex(cell => cell.isSnakeHead);
    return val;
  }

  getFoodCellIndex(): number {
    let val = this.GRID.findIndex(cell => cell.isFood);
    return val;
  }
}
