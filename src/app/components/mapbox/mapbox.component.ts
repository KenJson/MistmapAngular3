import { Component, OnInit } from '@angular/core';
import { MapboxkeyService } from '../../services/mapboxkey.service';
import mapboxgl from 'mapbox-gl';



@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [],
  templateUrl: './mapbox.component.html',
  styleUrl: './mapbox.component.scss'
})


export class MapboxComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 30.2672;
  lng: number = -97.7431;

  constructor(private mapboxKeyService: MapboxkeyService) { }

  ngOnInit() {
    mapboxgl.accessToken = this.mapboxKeyService.getMapboxKey();
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

    this.map.on('load', () => {
      this.map?.addSource('earthquakes', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
      });

      this.map?.addLayer({
        'id': 'earthquakes-layer',
        'type': 'circle',
        'source': 'earthquakes',
        'paint': {
          'circle-radius': 4,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white'
        }
      });

    });
  }

  toggleLayer(id: string) {
    const visibility = this.map?.getLayoutProperty(id, 'visibility');
    if (visibility === 'visible') {
      this.map?.setLayoutProperty(id, 'visibility', 'none');
    } else {
      this.map?.setLayoutProperty(id, 'visibility', 'visible');
    }
  }
}