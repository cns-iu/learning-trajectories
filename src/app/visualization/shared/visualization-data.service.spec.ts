import { TestBed, inject } from '@angular/core/testing';

import { VisualizationDataService } from './visualization-data.service';

describe('VisualizationDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisualizationDataService]
    });
  });

  it('should be created', inject([VisualizationDataService], (service: VisualizationDataService) => {
    expect(service).toBeTruthy();
  }));
});
