import { Component, OnInit } from '@angular/core';
import { MapboxkeyService } from '../../services/mapboxkey.service';
import mapboxgl from 'mapbox-gl';
import { MapLayerService } from '../../services/maplayer.service';
import { CommonModule } from '@angular/common';


interface FeatureProperties {
  Name: string;
  description: string;
}


@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapbox.component.html',
  styleUrl: './mapbox.component.scss'
})


export class MapboxComponent implements OnInit {

  map?: mapboxgl.Map | undefined;
  maploaded = false;
  style = 'mapbox://styles/mapbox/streets-v12';
  lat: number = 46.2044;
  lng: number = 6.1432;

  constructor(private mapboxKeyService: MapboxkeyService, private mapLayerService: MapLayerService) { }

  getIconNameForLayer(layerId: string): string {
    // Add your logic here to determine the icon name based on the layer ID
    // For now, we'll just return the layer ID, assuming that the icon has the same name as the layer
    return layerId;
  }

  ngOnInit() {
    mapboxgl.accessToken = this.mapboxKeyService.getMapboxKey();
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });


    this.map.on('load', () => {
      this.maploaded = true
      this.mapLayerService.getManifest().subscribe(manifest => {
        manifest.forEach(entry => {
          if (this.map) {
            const id = entry.geojson.split('.')[0]; // Use the filename without the extension as the ID
            this.mapLayerService.addSource(this.map, id, 'geojson', `assets/Geojsons/${entry.geojson}`);

            // Use the icon property of the entry to form the path to the icon image
            this.map.loadImage(`assets/icons/${entry.icon}`, (error, image) => {
              if (error) throw error;

              // Add the image to the map
              if (this.map && image) {
                this.map.addImage(id, image);

                // Add the layer using the image as the icon
                this.map.addLayer({
                  id: id,
                  type: 'symbol',
                  source: id,
                  layout: {
                    'icon-image': id,
                    'icon-size': 0.2
                  }
                });

                this.map.on('click', id, (e) => {
                  // Check that e.features is defined and has at least one element
                  if (e.features && e.features.length > 0) {
                    // Create a new popup and set its coordinates and HTML content
                    const properties = e.features[0].properties as FeatureProperties;
                    if (this.map) {
                      new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(`
                          <h3>${properties.Name}</h3>
                          <p>${properties.description}</p>
                        `)
                        .addTo(this.map);
                    }
                  }
                });

              }
            });
          }
        });
      });
    });
  };
}


