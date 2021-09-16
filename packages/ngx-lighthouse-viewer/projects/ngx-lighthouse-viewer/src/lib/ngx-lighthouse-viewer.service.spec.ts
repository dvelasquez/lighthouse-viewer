import { TestBed } from '@angular/core/testing';

import { NgxLighthouseViewerService } from './ngx-lighthouse-viewer.service';

describe('NgxLighthouseViewerService', () => {
  let service: NgxLighthouseViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxLighthouseViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
