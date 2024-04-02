import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import { MapLayerService } from './maplayer.service';
import { PointsWithinRadiusPipe } from '../pipes/points-within-radius.pipe';

@Injectable({
  providedIn: 'root'
})
export class PointsOfInterestService {
  constructor(private http: HttpClient, private mapLayerService: MapLayerService, private pointsWithinRadiusPipe: PointsWithinRadiusPipe) { }

  public getNearbyPoints(center: { lat: number, lng: number }): Observable<any> {
    return this.mapLayerService.getManifest().pipe(
      map(manifestEntries => manifestEntries.map(entry => `assets/Geojsons/${entry.geojson}`)),
      switchMap(urls => forkJoin(urls.map(url => this.http.get(url).pipe(
        map((geojson: any) => geojson.features
          .filter((feature: any) => feature.properties && feature.properties.name === 'Ancient Village or Settlement')
          .map((feature: any) => ({
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            name: feature.properties ? feature.properties.Name : 'Unknown'
          })))
      )))),
      map(points => this.pointsWithinRadiusPipe.transform(points, center, 10))
    );
  }
}
