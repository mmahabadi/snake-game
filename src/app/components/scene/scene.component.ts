import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval, scan, startWith, takeWhile } from 'rxjs';
import { COLS, ROWS, SPEED } from 'src/app/constants';
import { Direction } from 'src/app/types';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent implements OnDestroy {
  gameBoard: number[] = Array(COLS * ROWS).fill(0);
  snake: number[] = [180, 181, 182]; // initialize snake heading right
  direction: Direction = Direction.Right;
  private interval$!: Subscription;
  isGameOver = false;

  ngOnDestroy() {
    this.interval$.unsubscribe();
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

  startGame() {
    this.interval$ = interval(SPEED)
      .pipe(
        startWith(null),
        scan(() => this.moveSnake(this.snake, this.direction), this.snake),
        takeWhile(() => this.isSnakeInBounds(this.snake))
      )
      .subscribe(
        (snake: number[]) => {
          this.snake = snake;
        },
        console.error,
        () => (this.isGameOver = true)
      );
  }

  playAgain() {
    this.isGameOver = false;
    this.snake = [180, 181, 182];
    this.direction = Direction.Right;
    this.startGame();
  }

  moveSnake(snake: number[], direction: Direction): number[] {
    // calculate new head position
    const head = snake[snake.length - 1];
    const row = Math.floor(head / ROWS);
    const col = head % COLS;
    let newRow = row;
    let newCol = col;
    switch (direction) {
      case Direction.Up:
        newRow--;
        break;
      case Direction.Down:
        newRow++;
        break;
      case Direction.Left:
        newCol--;
        break;
      case Direction.Right:
        newCol++;
        break;
    }
    const newHead = newRow * ROWS + newCol;

    // move snake
    const newSnake = [...snake.slice(1), newHead];
    return newSnake;
  }

  isSnakeInBounds(snake: number[]): boolean {
    const head = snake[snake.length - 1];
    const row = Math.floor(head / ROWS);
    const col = head % COLS;
    const maxRow = ROWS - 1;
    const maxCol = COLS - 1;
    return col > 0 && col < maxCol && row > 0 && row < maxRow;
  }

  isSnakeSegment(index: number): boolean {
    return this.snake.indexOf(index) !== -1;
  }
}
