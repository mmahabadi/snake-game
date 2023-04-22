import { Component } from '@angular/core';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent {
  gameBoard: number[] = Array(400).fill(0);
  snake: number[] = [194, 195, 196];

  isSnakeSegment(index: number): boolean {
    return this.snake.indexOf(index) !== -1;
  }
}
