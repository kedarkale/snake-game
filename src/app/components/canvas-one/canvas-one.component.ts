import { AfterViewInit, Component, HostListener } from '@angular/core';

export enum Directions {
  UP,
  RIGHT,
  DOWN,
  LEFT
}

@Component({
  selector: 'app-canvas-one',
  templateUrl: './canvas-one.component.html',
  styleUrls: ['./canvas-one.component.scss']
})
export class CanvasOneComponent implements AfterViewInit {

  FRAME_INTERVAL_MS = 16.67; // 60 FPS
  DIRECTIONS = Directions;
  gameStarted = false;
  score = 0;
  snakeGameCanvasContext: CanvasRenderingContext2D | null = null;
  canvasHeight = 500;
  canvasWidth = 750;

  SNAKE_WIDTH = 10;
  SNAKE_SPEED = 1; // move by x pixel per frame
  currentTimestamp = 0;
  snakeVertices = [
    // {x: 60, y: 80},
    // {x: 60, y: 30},
    // {x: 30, y: 30},
    {x: 250, y: 100, dir: Directions.LEFT},
    {x: 300, y: 100, dir: Directions.LEFT}
  ];
  currentDirection = Directions.LEFT
  directionChanged = false;
  foodPosition = {x: 50, y: 50};

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
    const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
    if (canvas) this.snakeGameCanvasContext = canvas.getContext("2d");
    this.drawSnake();
  }

  gameLoop(latestTimeStamp: number) {
    
    // to facilitate 60Hz refresh rate
    let elapsedTime = latestTimeStamp - this.currentTimestamp;
    if (elapsedTime >= this.FRAME_INTERVAL_MS) {
      this.currentTimestamp = latestTimeStamp;
      this.clearCanvas();

      this.updateSnakePosition();
      this.drawSnake();
    }
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  updateSnakePosition() {
    // console.log(...this.snakeVertices);
    
    // update snake head
    if (this.directionChanged) {
      this.snakeVertices.unshift(this.getNextPixelOnDirectionChange(this.snakeVertices[0].x, this.snakeVertices[0].y, this.snakeVertices[0].dir, this.currentDirection));
      this.directionChanged = false;
    }
    else {
      this.snakeVertices[0] = this.getNextPixel(this.snakeVertices[0].x, this.snakeVertices[0].y, this.snakeVertices[0].dir);
    }

    // update snake tail
    let lastIndex = this.snakeVertices.length - 1;    
    this.snakeVertices[lastIndex] = this.getNextPixel(this.snakeVertices[lastIndex].x, this.snakeVertices[lastIndex].y, this.snakeVertices[lastIndex-1].dir);

    // remove vertices through which snake has passed
    if (
      this.snakeVertices[lastIndex].dir != this.snakeVertices[lastIndex-1].dir &&
      ((Math.abs(this.snakeVertices[lastIndex].x - this.snakeVertices[lastIndex-1].x) <= this.SNAKE_WIDTH + 0) || 
      (Math.abs(this.snakeVertices[lastIndex].y - this.snakeVertices[lastIndex-1].y) <= this.SNAKE_WIDTH + 0))
    ) {
      this.snakeVertices = this.snakeVertices.slice(0, -1);
    }
    if (
      this.snakeVertices[lastIndex].dir == this.snakeVertices[lastIndex-1].dir &&
      ((Math.abs(this.snakeVertices[lastIndex].x - this.snakeVertices[lastIndex-1].x) <= this.SNAKE_WIDTH + 0) &&
      (Math.abs(this.snakeVertices[lastIndex].y - this.snakeVertices[lastIndex-1].y) <= this.SNAKE_WIDTH + 0))
    ) {
      this.snakeVertices = this.snakeVertices.slice(0, -1);
    }

  }

  drawSnake() {
    console.log(...this.snakeVertices);
    
    for (let index = 0; index < this.snakeVertices.length - 1; index++) {
      const [x1, y1] = [this.snakeVertices[index].x, this.snakeVertices[index].y];
      const [x2, y2] = [this.snakeVertices[index+1].x, this.snakeVertices[index+1].y];
      const dir = this.snakeVertices[index+1].dir;
      this.snakeGameCanvasContext?.fillRect(x1, y1, (x2-x1 || this.SNAKE_WIDTH), (y2-y1 || this.SNAKE_WIDTH));
    }
  }

  clearCanvas() {
    this.snakeGameCanvasContext?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  startGame() {
    this.gameStarted = true;
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  restartGame() {

  }

  changeDirection(direction: Directions) {
    if (this.currentDirection != direction) {
      this.currentDirection = direction;
      this.directionChanged = true;
    }
  }

  getNextPixel(x: number, y: number, dir: Directions) {
    switch(dir) {
      case Directions.RIGHT:
        x += this.SNAKE_SPEED;
        break;
      case Directions.DOWN:
        y += this.SNAKE_SPEED;
        break;
      case Directions.LEFT:
        x -= this.SNAKE_SPEED;
        break;
      case Directions.UP:
        y -= this.SNAKE_SPEED;
        break;
    }    
    return {x, y, dir};
  }

  getNextPixelOnDirectionChange(previousX: number, previousY: number, previousDir: Directions, newDir: Directions) {
    let x: number = previousX, y: number = previousY;

    if (previousDir == Directions.DOWN && newDir == Directions.LEFT) {
      x = previousX - 0;
      y = previousY - this.SNAKE_WIDTH;
    }
    else if (previousDir == Directions.DOWN && newDir == Directions.RIGHT) {
      x = previousX + 0 + this.SNAKE_WIDTH;
      y = previousY - this.SNAKE_WIDTH;
    }
    else if (previousDir == Directions.RIGHT && newDir == Directions.DOWN) {
      y += 0 + this.SNAKE_WIDTH ;
      x = previousX - this.SNAKE_WIDTH;
    }
    else if (previousDir == Directions.RIGHT && newDir == Directions.UP) {
      y -= 0;
      x = previousX - this.SNAKE_WIDTH;
    }
    else if (previousDir == Directions.LEFT && newDir == Directions.UP) {
      y -= 0;
    }
    else if (previousDir == Directions.LEFT && newDir == Directions.DOWN) {
      y += 0 + this.SNAKE_WIDTH;
    }
    else if (previousDir == Directions.UP && newDir == Directions.LEFT) {
      x -= 0;
    }
    else if (previousDir == Directions.UP && newDir == Directions.RIGHT) {
      x += 0 + this.SNAKE_WIDTH;
    }

    return {x, y, dir: newDir}
  }
}
