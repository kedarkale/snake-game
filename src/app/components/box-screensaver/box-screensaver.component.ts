import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-box-screensaver',
  templateUrl: './box-screensaver.component.html',
  styleUrls: ['./box-screensaver.component.scss']
})
export class BoxScreensaverComponent implements AfterViewInit, AfterViewChecked {

  FRAME_INTERVAL_MS = 16.67; // 60 FPS
  screensaverCanvasContext: CanvasRenderingContext2D | null = null;
  canvasHeight = 500;
  canvasWidth = 750;

  indX = 0;
  indY = 0;
  currentTimestamp = 0;
  increaseY = true;
  increaseX = true;

  
  ngAfterViewInit(): void {
    const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
    if (canvas) this.screensaverCanvasContext = canvas.getContext("2d");

    requestAnimationFrame(this.drawBox.bind(this));
  }

  ngAfterViewChecked(): void {    
    this.canvasHeight = document.body.getBoundingClientRect().height - 2;
    this.canvasWidth = document.body.getBoundingClientRect().width - 2;
  }

  drawBox(latestTimeStamp: number) {

    // to facilitate 60Hz refresh rate
    let elapsedTime = latestTimeStamp - this.currentTimestamp;
    if (elapsedTime >= this.FRAME_INTERVAL_MS) {
      this.currentTimestamp = latestTimeStamp;
      this.clearCanvas();

      if (this.indX >= this.canvasWidth) {
        this.increaseX = false
      }
      else if (this.indX == 0) {
        this.increaseX = true
      }
      if (this.indY >= this.canvasHeight) {
        this.increaseY = false
      }
      else if (this.indY == 0) {
        this.increaseY = true
      }
      
      this.increaseX ? this.indX+=5 : this.indX-=5;
      this.increaseY ? this.indY+=5 : this.indY-=5;
      this.screensaverCanvasContext?.fillRect(this.indX-25, this.indY-25, 50, 50);
    }
    requestAnimationFrame(this.drawBox.bind(this));
  }

  clearCanvas() {
    this.screensaverCanvasContext?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
