import { TestBed } from '@angular/core/testing';

import { LayerToggleService } from './layer-toggle.service';

describe('LayerToggleService', () => {
  let service: LayerToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayerToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
