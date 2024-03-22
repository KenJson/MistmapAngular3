import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class LeylineService {
  map!: mapboxgl.Map;

  constructor(private http: HttpClient) { }

  setMap(map: mapboxgl.Map) {
    this.map = map;
  }

  moveLayerToTop(layerId: string) {
    if (this.map && this.map.getLayer(layerId)) {
      this.map.moveLayer(layerId);
    }
  }

  loadGeojson(filename: string) {
    return this.http.get(`assets/Geojsons/${filename}`).pipe(
      map((geojson: any) => {
        this.addLine(geojson, filename);
      })
    ).toPromise();
  }

  addLine(geojson: any, id: string) {
    this.map.addSource(id, {
      type: 'geojson',
      data: geojson
    });

    this.map.addLayer({
      id: id,
      type: 'line',
      source: id,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ff0000',
        'line-width': 80
      }
    });
  }
}