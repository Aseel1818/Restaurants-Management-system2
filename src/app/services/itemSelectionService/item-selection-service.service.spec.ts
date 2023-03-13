import { TestBed } from '@angular/core/testing';

import { ItemSelectionServiceService } from './item-selection-service.service';

describe('ItemSelectionServiceService', () => {
  let service: ItemSelectionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemSelectionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
