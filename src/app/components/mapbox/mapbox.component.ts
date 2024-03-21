import { Component, OnInit, Query } from '@angular/core';
import { CommonModule } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { IonicModule } from '@ionic/angular';
import { MapboxkeyService } from '../../services/mapboxkey.service';
import { MapLayerService } from '../../services/maplayer.service';
import { MapboxCtrlsService } from '../../services/mapbox-ctrls.service';
import { RadiusService } from '../../services/radius.service';
import { PointsWithinRadiusPipe } from '../../pipes/points-within-radius.pipe';
import { HttpClient } from '@angular/common/http';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { GoogleAuthProvider, User, signInWithPopup, signOut } from 'firebase/auth';
import { Auth, authState, user } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';



/*
// ts-ignore pour éviter l'erreur de compilation
// @ts-ignore
 
import { IonIcon2 } from 'ionicons';
import { addIcons } from 'ionicons/icons';
mapbox ctrls executé deux fois potentiellement
*/

//TODO: Régler MapboxDirections. Pas de DefinitlyTyped pour cette librairie apparamment. Ne pas oublier de régler mapbox-ctrls.service.ts également
// récup package.json et faire un npm install (récup liste des dépendances) (dependencies et devDependencies)

//TODO: Profil personnel , avec caméra avatar (camera existe), avec enregistrement de points favoris, achievments 
//(faire un guard qu'on met sur le routeur pour vérifier si l'utilisateur est connecté)
//TODO: Lignes telluriques, anomalies gravit + electromagn. (extra layers. a faire en dernier)


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



  private points: { lat: number, lng: number, name: string }[] = [];



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
    private readonly _firestore: Firestore,
    private readonly _auth: Auth,

  ) { }

  getIconNameForLayer(layerId: string): string {
    return layerId;
  }

  //Firebase Authentification (checker si le pack est bien installé. problème avec collection.json introuvable)
  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this._auth, provider);
  }

  async logout(): Promise<void> { await signOut(this._auth); }

  authState(): Observable<User | null> {
    return user(this._auth);
  }




  /*
//gestion des données avec Cloud Firestore
@param uid
loadTodo(uid: string): void {
const fbCollection = collection(this._firestore, 'demo-todos');
const limitTo: QueryConstraint = limit(10);
const isTodo: QueryConstraint = where('done', '==', false);
const byUserId: QueryConstraint = where('userId', '==', uid);
const query: Query = query(fbCollection, isTodo, byUserId, limitTo);
const datas = collectionData(q, { idField: 'id' });
}
*/

  private firebaseConfig = {
    apiKey: "AIzaSyBqHkgxgreoLEV3A_lk6NnSVpnHb82qKiY",
    authDomain: "mistmap-angu.firebaseapp.com",
    projectId: "mistmap-angu",
    storageBucket: "mistmap-angu.appspot.com",
    messagingSenderId: "1035644163878",
    appId: "1:1035644163878:web:b96e8f2b415ebcf01cd3e7",
    measurementId: "G-GGHJLRSPJ0"
  };

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

    const app = initializeApp(this.firebaseConfig);
    const analytics = getAnalytics(app);
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


}


