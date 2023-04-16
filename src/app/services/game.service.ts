import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, scan, share } from 'rxjs';
import { SNAKE_LENGTH } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy{
  lengthSource$ = new BehaviorSubject<number>(SNAKE_LENGTH);
  length$ = this.lengthSource$.asObservable();

  snakeLength$ = this.length$.pipe(
    scan((step, snakeLength) => snakeLength + step),
    map( length => [].constructor(length)),
    share()
  );

   constructor() { }

   ngOnDestroy(): void {
      this.lengthSource$.complete();
   }
}
