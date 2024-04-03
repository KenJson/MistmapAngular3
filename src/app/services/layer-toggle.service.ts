import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayerToggleService {
  constructor() { }


  toggleLayerVisibility(map: any, name: string): void {
    var visibility = map.getLayoutProperty(name, 'visibility');

    if (visibility === 'visible') {
      map.setLayoutProperty(name, 'visibility', 'none');
    } else {
      map.setLayoutProperty(name, 'visibility', 'visible');
    }
  }
}