import { TestBed } from '@angular/core/testing';

import { DresService } from './dres.service';

describe('DresService', () => {
  let service: DresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
