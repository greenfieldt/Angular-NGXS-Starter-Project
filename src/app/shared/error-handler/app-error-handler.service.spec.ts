import { TestBed } from '@angular/core/testing';

import { AppErrorHandlerService } from './app-error-handler.service';

describe('AppErrorHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppErrorHandlerService = TestBed.get(AppErrorHandlerService);
    expect(service).toBeTruthy();
  });
});
