import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobLandingComponent } from './job-landing.component';

describe('JobLandingComponent', () => {
  let component: JobLandingComponent;
  let fixture: ComponentFixture<JobLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
