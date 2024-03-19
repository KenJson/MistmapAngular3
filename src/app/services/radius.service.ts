import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RadiusService {

  constructor() { }

  getPointsWithinRadius(points: { lat: number, lng: number }[], center: { lat: number, lng: number }, radius: number) {
    const R = 6371; // Radius of the earth in km
    const pointsWithinRadius = points.filter(point => {
      const dLat = this.deg2rad(point.lat - center.lat);
      const dLng = this.deg2rad(point.lng - center.lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(center.lat)) * Math.cos(this.deg2rad(point.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
        ;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      console.log(`Distance from center: ${distance} km`);
      return distance <= radius;
    });

    return pointsWithinRadius;
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }
}