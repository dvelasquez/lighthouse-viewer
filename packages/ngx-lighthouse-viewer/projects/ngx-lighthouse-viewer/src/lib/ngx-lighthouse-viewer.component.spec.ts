import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxLighthouseViewerComponent } from './ngx-lighthouse-viewer.component';

describe('NgxLighthouseViewerComponent', () => {
  let component: NgxLighthouseViewerComponent;
  let fixture: ComponentFixture<NgxLighthouseViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxLighthouseViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxLighthouseViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
