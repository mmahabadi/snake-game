import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  Subscription,
  interval,
  scan,
  startWith,
  takeWhile,
} from 'rxjs';
import { SPEED } from 'src/app/constants';
import { Direction } from 'src/app/types';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent implements OnDestroy {
  gameBoard: number[] = Array(400).fill(0);
  snake: number[] = [180, 181, 182]; // initialize snake heading right
  direction: Direction = Direction.Right;
  private interval$!: Subscription;

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
      this.interval$ = interval(SPEED)
        .pipe(
          startWith(null),
          scan(() => this.moveSnake(this.snake, this.direction), this.snake),
          takeWhile(() => this.isSnakeInBounds(this.snake))
        )
        .subscribe((snake: number[]) => {
          this.snake = snake;
        });
    }
  }

  moveSnake(snake: number[], direction: Direction): number[] {
    // calculate new head position
    const head = snake[snake.length - 1];
    const row = Math.floor(head / 20);
    const col = head % 20;
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
    const newHead = newRow * 20 + newCol;

    // move snake
    const newSnake = [...snake.slice(1), newHead];
    return newSnake;
  }

  isSnakeInBounds(snake: number[]): boolean {
    const head = snake[snake.length - 1];
    const row = Math.floor(head / 20);
    const col = head % 20;
    return col > 0 && col < 19 && row >= 0 && row < 19;
  }

  isSnakeSegment(index: number): boolean {
    return this.snake.indexOf(index) !== -1;
  }
}
