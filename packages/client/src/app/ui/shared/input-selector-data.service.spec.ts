import { TestBed, inject } from '@angular/core/testing';

import { InputSelectorDataService } from './input-selector-data.service';

describe('InputSelectorDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputSelectorDataService]
    });
  });

  it('should be created', inject([InputSelectorDataService], (service: InputSelectorDataService) => {
    expect(service).toBeTruthy();
  }));
});
