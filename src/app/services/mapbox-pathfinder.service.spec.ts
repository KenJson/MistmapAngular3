import { TestBed } from '@angular/core/testing';

import { MapboxPathfinderService } from './mapbox-pathfinder.service';

describe('MapboxPathfinderService', () => {
  let service: MapboxPathfinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapboxPathfinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
