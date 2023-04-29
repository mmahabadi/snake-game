import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval, scan, startWith, takeWhile } from 'rxjs';
import { COLS, ROWS, SPEED, CEL_SIZE } from 'src/app/constants';
import { Direction } from 'src/app/types';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent implements OnInit, OnDestroy {
  gameBoard: number[] = Array(COLS * ROWS).fill(0);
  snake: number[] = [180, 181, 182]; // initialize snake heading right
  direction: Direction = Direction.Right;
  private interval$!: Subscription;
  isGameOver = false;
  food: number = 0;
  animationFrameId!: number;
  templateColStyle = `repeat(${COLS}, ${CEL_SIZE}px)`;
  templateRowStyle = `repeat(${ROWS}, ${CEL_SIZE}px)`;

  ngOnDestroy() {
    this.interval$.unsubscribe();
  }

  ngOnInit(): void {
    // generate initial food position
    this.generateFood();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if (this.direction !== Direction.Down) {
          this.direction = Direction.Up;
        }
        break;
      case 'ArrowDown':
        if (this.direction !== Direction.Up) {
          this.direction = Direction.Down;
        }
        break;
      case 'ArrowLeft':
        if (this.direction !== Direction.Right) {
          this.direction = Direction.Left;
        }
        break;
      case 'ArrowRight':
        if (this.direction !== Direction.Left) {
          this.direction = Direction.Right;
        }
        break;
    }

    if (!this.interval$) {
      this.startGame();
    }
  }

  tick() {
    this.animationFrameId = window.requestAnimationFrame(() => this.tick());
  }

  startGame() {
    this.tick();
    this.interval$ = interval(SPEED)
      .pipe(
        startWith(null),
        scan(() => this.moveSnake(), this.snake),
        takeWhile(() => !this.isGameOver)
      )
      .subscribe(
        (snake: number[]) => {
          this.snake = snake;
        },
        null,
        () => {
          this.animationFrameId = requestAnimationFrame(() => this.startGame());
          this.gameOver();
        }
      );
  }

  playAgain() {
    this.isGameOver = false;
    this.snake = [180, 181, 182];
    this.direction = Direction.Right;
    this.startGame();
  }

  moveSnake(): number[] {
    let newHeadIndex;
    const currentHeadIndex = this.snake[this.snake.length - 1];

    switch (this.direction) {
      case Direction.Right:
        newHeadIndex = currentHeadIndex + 1;
        break;
      case Direction.Left:
        newHeadIndex = currentHeadIndex - 1;
        break;
      case Direction.Up:
        newHeadIndex = currentHeadIndex - ROWS;
        break;
      case Direction.Down:
        newHeadIndex = currentHeadIndex + ROWS;
        break;
    }

    const newSnake = [...this.snake.slice(), newHeadIndex];

    if (
      this.snake.indexOf(newHeadIndex) !== -1 ||
      !this.isSnakeInBounds(currentHeadIndex)
    ) {
      this.gameOver();
      return [];
    }

    if (this.isFood(newHeadIndex)) {
      this.generateFood();
    } else {
      newSnake.shift();
    }

    return newSnake;
  }

  isSnakeInBounds(head: number): boolean {
    const col = head % ROWS;
    const row = Math.floor(head / ROWS);

    const maxRow = ROWS - 1;
    const maxCol = COLS - 1;
    return col > 0 && col < maxCol && row > 0 && row < maxRow;
  }

  isSnakeSegment(index: number): boolean {
    return this.snake.indexOf(index) !== -1;
  }

  generateFood() {
    // generate random food position that's not already part of the snake
    do {
      this.food = Math.floor(Math.random() * 400);
    } while (this.isSnakeSegment(this.food));
  }

  isFood(index: number): boolean {
    return this.food === index;
  }

  gameOver() {
    this.isGameOver = true;
    cancelAnimationFrame(this.animationFrameId);
  }
}
