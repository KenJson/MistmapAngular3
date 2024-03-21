import { Injectable } from '@angular/core';


/*Implémenter comme cecici:

 constructor(private intersectionService: IntersectionService) {
    const intersection = this.intersectionService.findIntersection([0, 0], [1, 1], [1, 0], [0, 1]);
    console.log(intersection); // Logs: [0.5, 0.5]
  }
  
  */

@Injectable({
  providedIn: 'root',
})
export class IntersectionService {
  findIntersection(p1: number[], p2: number[], p3: number[], p4: number[]) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const [x3, y3] = p3;
    const [x4, y4] = p4;

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
      ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
      ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      const x = x1 + ua * (x2 - x1);
      const y = y1 + ua * (y2 - y1);
      return [x, y];
    } else {
      return null;
    }
  }
}