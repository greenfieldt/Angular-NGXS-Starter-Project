import { TestBed } from '@angular/core/testing';

import { SWUpdateService } from './swupdate.service';

describe('SWUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SWUpdateService = TestBed.get(SWUpdateService);
    expect(service).toBeTruthy();
  });
});
