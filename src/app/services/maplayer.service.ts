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




    });
  }
}