import { TestBed } from '@angular/core/testing';

import { ChartDataResolver } from './chart-data.resolver';

describe('ChartDataResolver', () => {
  let resolver: ChartDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ChartDataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
