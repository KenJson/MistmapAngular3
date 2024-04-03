import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'; // Add missing import

@Injectable({
  providedIn: 'root'
})
export class GeojsonService {
  constructor(private http: HttpClient) { }

  loadManifest(): Promise<any> {
    return this.http.get('assets/Menhirfest.json').pipe(
      map((manifest: any) => {
        const promises = manifest.map((entry: any) => this.loadGeojson(entry.geojson));
        return Promise.all(promises);
      })
    ).toPromise();
  }

  loadGeojson(geojson: any): Promise<any> {

    return this.http.get(geojson).toPromise();
  }
}
