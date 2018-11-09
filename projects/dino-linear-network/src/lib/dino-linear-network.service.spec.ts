import { TestBed } from '@angular/core/testing';

import { DinoLinearNetworkService } from './dino-linear-network.service';

describe('DinoLinearNetworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DinoLinearNetworkService = TestBed.get(DinoLinearNetworkService);
    expect(service).toBeTruthy();
  });
});
