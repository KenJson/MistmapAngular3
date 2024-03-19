import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { IonicModule } from '@ionic/angular';
import { MapboxkeyService } from '../../services/mapboxkey.service';
import { MapLayerService } from '../../services/maplayer.service';
import { MapboxCtrlsService } from '../../services/mapbox-ctrls.service';
import { RadiusService } from '../../services/radius.service';
import { PointsWithinRadiusPipe } from '../../pipes/points-within-radius.pipe';
import { HttpClient } from '@angular/common/http';

/*
// ts-ignore pour éviter l'erreur de compilation
// @ts-ignore
import { MapboxDirections } from '@mapbox/mapbox-gl-directions';
*/

//TODO: Régler MapboxDirections. Pas de DefinitlyTyped pour cette librairie apparamment. Ne pas oublier de régler mapbox-ctrls.service.ts également
// récup package.json et faire un npm install (récup liste des dépendances) (dependencies et devDependencies)
//TODO: Profil personnel, avec caméra avatar, avec enregistrement de points favoris, achievments 
//(faire un guard qu'on met sur le routeur pour vérifier si l'utilisateur est connecté)
//TODO: Lignes telluriques, anomalies gravit + electromagn. 


interface FeatureProperties {
  Name: string;
  description: string;
}

interface Point {
  lat: number;
  lng: number;
  name: string;
}


@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [CommonModule, IonicModule,],
  templateUrl: './mapbox.component.html',
  styleUrl: './mapbox.component.scss'
})


export class MapboxComponent implements OnInit {

  map?: mapboxgl.Map | undefined;
  maploaded = false;
  style = 'mapbox://styles/mapbox/streets-v12';
  lat: number = 46.2044;
  lng: number = 6.1432;



  private points: { lat: number, lng: number, name: string }[] = [];

  //a mettre dans un autre compartiment

  showNearbyPoints(map: mapboxgl.Map | undefined) {
    if (!map) {
      console.error('Map is not initialized');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Get the list of points from your MapLayerService
      this.mapLayerService.getManifest().subscribe(manifestEntries => {
        // For each entry in the manifest, load the corresponding GeoJSON file
        manifestEntries.forEach((entry, index) => {

          const url = `assets/Geojsons/${entry.geojson}`;


          // Load the GeoJSON file
          this.http.get(url).subscribe((geojson: any) => {
            // Add the points from the GeoJSON file to the points array
            this.points.push(...geojson.features.map((feature: any) => ({
              lat: feature.geometry.coordinates[1],
              lng: feature.geometry.coordinates[0],
              name: feature.properties ? feature.properties.Name : 'Unknown'
            })));

            // Get the points within the radius
            const pointsWithinRadius = this.pointsWithinRadiusPipe.transform(this.points, center, 10);
            console.log(this.points, pointsWithinRadius);

            const pointsList = pointsWithinRadius.map(point => `<li>${point.name}</li>`).join('');



            if (pointsList.length > 0) {

              new mapboxgl.Popup()
                .setLngLat(center)
                .setHTML(`<ul>${pointsList}</ul>`)
                .addTo(map);
            } else {
              console.log('No points within the radius');
            }
          });
        });



      });

    });
  }
  private pointsWithinRadiusPipe = new PointsWithinRadiusPipe();

  constructor(
    private http: HttpClient,
    private mapboxKeyService: MapboxkeyService,
    private mapLayerService: MapLayerService,
    private mapboxCtrlsService: MapboxCtrlsService,
    private radiusService: RadiusService,

  ) { }

  getIconNameForLayer(layerId: string): string {
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

    this.mapboxCtrlsService.addNavigationControl(this.map, 'top-right');
    this.mapboxCtrlsService.addGeolocateControl(this.map, 'top-right');
    /*
    // Uncomment this if you have the MapboxDirections module
    this.mapboxCtrlsService.addDirectionsControl(this.map, 'top-left');
*/

    this.map.on('load', () => {
      this.maploaded = true
      this.mapLayerService.getManifest().subscribe(manifest => {
        manifest.forEach(entry => {
          if (this.map) {
            //    this.mapboxDirectionsService.initialize(this.map, mapboxgl.accessToken);
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

                  if (e.features && e.features.length > 0) {

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



      /*  // Add navigation control to the map
        const nav = new mapboxgl.NavigationControl();
        if (this.map) {
          this.map.addControl(nav, 'top-right');
        }
  */

      // Add directions control to the map
      /* const directions = new MapboxDirections({
         accessToken: mapboxgl.accessToken,
         unit: 'metric',
   
       });
       if (this.map) {
         this.map.addControl(directions, 'top-left');
       }
       */

      /*
     // Add geolocate control to the map
     const geolocate = new mapboxgl.GeolocateControl({
       positionOptions: {
         enableHighAccuracy: true
       },
       trackUserLocation: true
     });
     if (this.map) {
       this.map.addControl(geolocate, 'top-right');
     }
  */
    });
  };


}


