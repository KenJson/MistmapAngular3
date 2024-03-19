
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
/*
// @ts-ignore
import MapboxDirections from '@mapbox/mapbox-gl-directions';
*/

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

  // Uncomment this if you have the MapboxDirections module
  /*
    addDirectionsControl(map: mapboxgl.Map, position: ControlPosition) {
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
      });
      map.addControl(directions, position);
    }
  */
}