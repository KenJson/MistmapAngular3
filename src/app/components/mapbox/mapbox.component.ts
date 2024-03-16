import { Component, OnInit } from '@angular/core';
import { MapboxkeyService } from '../../services/mapboxkey.service';
import mapboxgl from 'mapbox-gl';
import { MapLayerService } from '../../services/maplayer.service';




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
  lat: number = 46.2044;
  lng: number = 6.1432;

  constructor(private mapboxKeyService: MapboxkeyService, private mapLayerService: MapLayerService) { }

  ngOnInit() {
    mapboxgl.accessToken = this.mapboxKeyService.getMapboxKey();
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

    this.map.on('load', () => {
      this.mapLayerService.getManifest().subscribe(files => {
        files.forEach(file => {
          if (this.map) {
            const id = file.split('.')[0]; // Use the filename without the extension as the ID
            this.mapLayerService.addSource(this.map, id, 'geojson', `assets/Geojsons/${file}`);
            this.mapLayerService.addLayer(this.map, id, 'circle', id, {
              'circle-radius': 4,
              'circle-stroke-width': 2,
              'circle-color': 'red',
              'circle-stroke-color': 'white'
            });
          }
        });
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