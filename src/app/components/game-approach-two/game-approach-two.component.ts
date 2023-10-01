import { AfterViewInit, Component, HostListener } from '@angular/core';

export enum Directions {
  UP,
  RIGHT,
  DOWN,
  LEFT
}

@Component({
  selector: 'app-game-approach-two',
  templateUrl: './game-approach-two.component.html',
  styleUrls: ['./game-approach-two.component.scss']
})
export class GameApproachTwoComponent implements AfterViewInit {

  enableDebugMode = false;
  DIRECTIONS = Directions;
  BOARD_SIZE: number = 25;
  BOARD_REFRESH_INTERVAL_MS = 150; // also controls snake speed, higher refresh interval == slower snake
  MIN_INTERVAL_LIMIT = 16.67; // controls max snake speed limit, also 60 FPS
  tempArray: Array<number> = Array(this.BOARD_SIZE);
  snakeCellIndexes: number[] = [];
  foodCellIndex: number | undefined;
  gameStarted: boolean = false;
  currentDirection = Directions.RIGHT;
  score = 0;
  currentTimestamp = 0;

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

  ngAfterViewInit(): void {
    this.setStartState();
  }

  setStartState() {
    this.gameStarted = false;
    this.BOARD_REFRESH_INTERVAL_MS = 150;
    this.score= 0;
    this.snakeCellIndexes = [3, 2, 1, 0];
    this.currentDirection = Directions.RIGHT;
    this.addFoodToRandomCell(true);
    this.updateBoardState();
  }

  startGame() {
    this.gameStarted = true;
    // game loop
    requestAnimationFrame(this.generateFrame.bind(this));    
  }

  generateFrame(latestTimestamp: number) {
    if (latestTimestamp - this.currentTimestamp >= this.BOARD_REFRESH_INTERVAL_MS) {
      this.currentTimestamp = latestTimestamp;
      if (!this.checkCollision()) {
        this.moveSnake();
      }
    }

    if (this.gameStarted) requestAnimationFrame(this.generateFrame.bind(this));
  }

  restartGame() {
    this.setStartState();
  }

  moveSnake() {
    let foodConsumed = false;
    let nextCell = this.getNextCellIndex(this.getSnakeHeadIndex(), this.currentDirection);
    // food handling
    if (nextCell == this.foodCellIndex) {
      foodConsumed = true;
      this.consumeFood();
    }
    this.snakeCellIndexes.unshift(nextCell);
    if (!foodConsumed) this.snakeCellIndexes.pop();
    this.updateBoardState();
  }

  consumeFood() {
    this.score++;
    this.addFoodToRandomCell(true);
    if (this.BOARD_REFRESH_INTERVAL_MS > this.MIN_INTERVAL_LIMIT) this.BOARD_REFRESH_INTERVAL_MS-=5; 
  }

  updateBoardState() {
    for (let index = 0; index < (this.BOARD_SIZE*this.BOARD_SIZE); index++) {
      let cell = document.getElementById(`cell-${index}`)
      if (cell) {
        cell.setAttribute("style", "");
      }      
    }
    this.renderSnake();
    this.renderFood();
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
  }

  checkCollision(): boolean {
    let headIndex = this.getSnakeHeadIndex();
    let nextMoveIndex = this.getNextCellIndex(headIndex, this.currentDirection)
    // out of board
    if (
      nextMoveIndex < 0 ||
      nextMoveIndex >= this.BOARD_SIZE*this.BOARD_SIZE ||
      (headIndex%this.BOARD_SIZE == this.BOARD_SIZE-1 && nextMoveIndex%this.BOARD_SIZE == 0) ||
      (nextMoveIndex%this.BOARD_SIZE == this.BOARD_SIZE-1 && headIndex%this.BOARD_SIZE == 0)
    ) {
      alert(`Collision! Game Over! Your Score was ${this.score}`);
      this.setStartState();
      return true;
    }
    // collision with self
    if (this.snakeCellIndexes.includes(nextMoveIndex)) {
      alert(`Collision with self! Game Over! Your score was ${this.score}`);
      this.setStartState();
      return true;
    }
    return false;
  }

  getSnakeHeadIndex(): number {
    return this.snakeCellIndexes[0];
  }

  addFoodToRandomCell(regenerate = false) {
    if (this.foodCellIndex && !regenerate) return;

    let foodAdded = false;
    while (!foodAdded) {
      let randomCell = Math.floor(Math.random()*this.BOARD_SIZE*this.BOARD_SIZE);
      if (!this.snakeCellIndexes.includes(randomCell)) {
        this.foodCellIndex = randomCell;
        foodAdded = true;
      }
    }
  }

  renderFood() {
    let cell = document.getElementById(`cell-${this.foodCellIndex}`);
    if (cell) {
      cell.setAttribute("style", "background-color: red");
    }
  }

  renderSnake() {
    this.snakeCellIndexes.forEach((ci, index) => {
      let cell = document.getElementById(`cell-${ci}`);
      if (cell) {
        switch(index) {
          case 0:
            cell.setAttribute("style", "background-color: darkgreen");
            break;
          case (this.snakeCellIndexes.length-1):
            cell.setAttribute("style", "background-color: yellowgreen");
            break;
          default:
            cell.setAttribute("style", "background-color: green");
            break;
        }
      }      
    });
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

}
