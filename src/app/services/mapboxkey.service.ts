import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapboxkeyService {
  private mapboxKey = 'pk.eyJ1Ijoia3Vyb2tlbmppIiwiYSI6ImNscXdwc25mcDA0eG8ycXB6dnQxa3VwY2EifQ.xtoJugCZoB8GSZHVYuzOYA';

  constructor() { }

  getMapboxKey() {
    return this.mapboxKey;
  }
}
