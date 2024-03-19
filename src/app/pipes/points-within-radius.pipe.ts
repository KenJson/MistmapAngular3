import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pointsWithinRadius'
})
export class PointsWithinRadiusPipe implements PipeTransform {

  transform(points: {
    lat: number, lng: number, name: string
    ,
  }[], center: { lat: number, lng: number }, radius: number): { lat: number, lng: number, name: string }[] {
    // Convert the radius from kilometers to degrees
    const radiusInDegrees = radius / 111.12;

    return points.filter(point => {
      const latDifference = Math.abs(center.lat - point.lat);
      const lngDifference = Math.abs(center.lng - point.lng);

      // Use the Pythagorean theorem to calculate the distance between the points
      const distance = Math.sqrt(Math.pow(latDifference, 2) + Math.pow(lngDifference, 2));

      return distance <= radiusInDegrees;
    });
  }
}

// Expliquation: This function takes a center point, a radius in kilometers, and an array of points, and returns an array of the points that are within the radius from the center point. The distance between the points is calculated using the Pythagorean theorem, and the radius is converted from kilometers to degrees since the latitude and longitude are in degrees.