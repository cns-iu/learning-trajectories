import { TestBed, inject } from '@angular/core/testing';

import { PersonSelectorDataService } from './person-selector-data.service';

describe('PersonSelectorDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonSelectorDataService]
    });
  });

  it('should be created', inject([PersonSelectorDataService], (service: PersonSelectorDataService) => {
    expect(service).toBeTruthy();
  }));
});
