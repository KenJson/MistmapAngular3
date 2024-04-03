import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pointsWithinRadius'
})
export class PointsWithinRadiusPipe implements PipeTransform {

  transform(points: {
    lat: number, lng: number, name: string
    ,
  }[], center: { lat: number, lng: number }, radius: number): { lat: number, lng: number, name: string }[] {

    const radiusInDegrees = radius / 111.12;

    return points.filter(point => {
      const latDifference = Math.abs(center.lat - point.lat);
      const lngDifference = Math.abs(center.lng - point.lng);

      const distance = Math.sqrt(Math.pow(latDifference, 2) + Math.pow(lngDifference, 2));

      return distance <= radiusInDegrees;
    });
  }
}

