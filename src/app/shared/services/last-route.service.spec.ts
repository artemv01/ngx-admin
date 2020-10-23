import { TestBed } from '@angular/core/testing';

import { LastRouteService } from './last-route.service';

describe('LastRouteService', () => {
  let service: LastRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
