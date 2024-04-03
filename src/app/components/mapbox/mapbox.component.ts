// Angular imports
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Third-party imports
import mapboxgl from 'mapbox-gl';
import { IonicModule } from '@ionic/angular';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, User, signInWithPopup, signOut } from 'firebase/auth';
import { Auth, user } from '@angular/fire/auth';

// Application imports
import { environment } from '../../../environments/environment';
import { MapboxkeyService } from '../../services/mapboxkey.service';
import { MapLayerService } from '../../services/maplayer.service';
import { MapboxCtrlsService } from '../../services/mapbox-ctrls.service';
import { LayerToggleService } from '../../services/layer-toggle.service';
import { LeylineService } from '../../services/leyline.service';
import { PointsOfInterestService } from '../../services/points-of-interest.service';


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
  imports: [
    CommonModule,
    IonicModule,
    RouterOutlet
  ],
  templateUrl: './mapbox.component.html',
  styleUrl: './mapbox.component.scss'
})


export class MapboxComponent implements OnInit {

  map?: mapboxgl.Map | undefined;
  maploaded = false;
  style = 'mapbox://styles/mapbox/streets-v12';
  lat: number = 46.2044;
  lng: number = 6.1432;
  isLoggedIn: boolean = false;
  public loaded = false;




  constructor(

    private mapboxKeyService: MapboxkeyService,
    private mapLayerService: MapLayerService,
    private mapboxCtrlsService: MapboxCtrlsService,
    private readonly _auth: Auth,
    private router: Router,
    private layerToggleService: LayerToggleService,
    private leylineService: LeylineService,
    private pointsOfInterestService: PointsOfInterestService,

  ) { }


  goToProfile() {
    this.router.navigate(['/profile']);
  }


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

      this.pointsOfInterestService.getNearbyPoints(center).subscribe((pointsWithinRadius: Point[]) => {
        const pointsList = pointsWithinRadius.flat().map((point: Point) => `<li>${point.name}</li>`).join('');

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
  }


  getIconNameForLayer(layerId: string): string {
    return layerId;
  }


  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this._auth, provider);
  }

  async logout(): Promise<void> { await signOut(this._auth); }

  authState(): Observable<User | null> {
    return user(this._auth);
  }

  ngOnInit() {
    mapboxgl.accessToken = this.mapboxKeyService.getMapboxKey();

    this.authState().subscribe((user) => {
      this.isLoggedIn = !!user;
    });


    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

    this.leylineService.setMap(this.map);
    const app = initializeApp(environment.firebase);
    const analytics = getAnalytics(app);
    this.mapboxCtrlsService.addNavigationControl(this.map, 'top-right');
    this.mapboxCtrlsService.addGeolocateControl(this.map, 'top-right');

    /*
    // Uncomment this if you have the MapboxDirections module
    this.mapboxCtrlsService.addDirectionsControl(this.map, 'top-left');
*/
    //test zone for lines 

    this.map.on('load', () => {
      if (this.map) {
        this.map.addSource('line1', {
          type: 'geojson',
          data: './assets/leyline_menhir.geojson'
        });

        this.map.addLayer({
          id: 'line-layer1',
          type: 'line',
          source: 'line1',
          layout: {},
          paint: {
            'line-color': '#FF0000',
            'line-width': 8
          }
        });
      }


      if (this.map) {
        this.map.addSource('line2', {
          type: 'geojson',
          data: './assets/leyline_villages.geojson'
        });
      }

      if (this.map) {
        this.map.addLayer({
          id: 'line-layer2',
          type: 'line',
          source: 'line2',
          layout: {},
          paint: {
            'line-color': '#0000FF',
            'line-width': 8
          }
        });
      }



      //test zone for lines

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

                //   const uniqueId = `${id}-${Date.now()}`;




                this.map.on('click', id, (e) => {
                  console.log('Feature clicked:', e);
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
        }

        );
        this.leylineService.moveLayerToTop('leyline');


      });





      /*
            // Add directions control to the map
           const directions = new MapboxDirections({
               accessToken: mapboxgl.accessToken,
               unit: 'metric',
         
             });
             if (this.map) {
               this.map.addControl(directions, 'top-left');
             }
          
      */



    });
  };

  loadLeyline(filename: string) {
    this.leylineService.loadGeojson(filename).then(() => {
      console.log('Leyline loaded');
    }).catch(err => {
      console.error(err);
    });
  }

  onToggleLayer(name: string): void {
    // Use the service to toggle layer visibility
    this.layerToggleService.toggleLayerVisibility(this.map, name);
  }

  moveLayerToTop(layerId: string) {
    if (this.map && this.map.getLayer(layerId)) {
      this.map.moveLayer(layerId);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}


