
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


type ControlPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

@Injectable({
  providedIn: 'root'
})
export class MapboxCtrlsService {



  constructor() { }

  addNavigationControl(map: mapboxgl.Map, position: ControlPosition) {
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, position);
  }

  addGeolocateControl(map: mapboxgl.Map, position: ControlPosition) {
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    map.addControl(geolocate, position);
  }


}