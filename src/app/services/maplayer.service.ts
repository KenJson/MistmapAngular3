import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface MenhirfestEntry {
  geojson: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapLayerService {


  constructor(private http: HttpClient) { }



  getManifest(): Observable<MenhirfestEntry[]> {
    return this.http.get<MenhirfestEntry[]>('assets/Menhirfest.json');
  }

  addSource(map: mapboxgl.Map, id: string, type: any, data: any) {
    map.addSource(id, {
      type: type,
      data: data
    });
  }

  addLayer(map: mapboxgl.Map, id: string, type: any, source: string, paint: any) {
    map.addLayer({
      id: id,
      type: type,
      source: source,
      paint: paint
    });
  }

  addSourcesAndLayers(map: mapboxgl.Map) {
    map.on('load', () => {

      /*
        this.addSource(map, 'earthquakes', 'geojson', 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson');
        this.addLayer(map, 'earthquakes-layer', 'circle', 'earthquakes', {
          'circle-radius': 4,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white'
          
        });
  */

    });
  }
}