import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'; // Add missing import
@Injectable({
  providedIn: 'root'
})
export class GeojsonService {
  constructor(private http: HttpClient) { }

  loadManifest(): Promise<any> { // Fix return type
    return this.http.get('assets/Menhirfest.json').pipe(
      map((manifest: any) => { // Fix type error
        const promises = manifest.map((entry: any) => this.loadGeojson(entry.geojson));
        return Promise.all(promises);
      })
    ).toPromise();
  }

  loadGeojson(geojson: any): Promise<any> {
    // Implement the logic to load the geojson
    // For example, you can use the HttpClient to make a request
    return this.http.get(geojson).toPromise();
  }
}
