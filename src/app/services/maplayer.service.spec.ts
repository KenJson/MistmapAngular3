import { TestBed } from '@angular/core/testing';

import { MapLayerService } from './maplayer.service';

describe('MaplayerService', () => {
  let service: MapLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
