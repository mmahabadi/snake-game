import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
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
export class SceneComponent implements OnInit {
  gameBoard: number[] = Array(400).fill(0);
  snake: number[] = [180, 181, 182]; // initialize snake heading right
  direction: Direction = Direction.Right;

  ngOnInit(): void {
    interval(SPEED)
        .pipe(
          startWith(null),
          scan(() => this.moveSnake(this.snake, this.direction), this.snake),
          takeWhile(() => this.isSnakeInBounds(this.snake))
        )
        .subscribe((snake: number[]) => {
          this.snake = snake;
        });
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
    return col > 0 && col < 19 && row > 0 && row < 19;
  }

  isSnakeSegment(index: number): boolean {
    return this.snake.indexOf(index) !== -1;
  }
}
