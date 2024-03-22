import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayerToggleService {
  constructor() { }

  // Toggle the visibility of a layer with a specific name
  toggleLayerVisibility(map: any, name: string): void {
    // Get the current visibility of the layer
    var visibility = map.getLayoutProperty(name, 'visibility');

    // Toggle the visibility based on the current visibility
    if (visibility === 'visible') {
      map.setLayoutProperty(name, 'visibility', 'none');
    } else {
      map.setLayoutProperty(name, 'visibility', 'visible');
    }
  }
}