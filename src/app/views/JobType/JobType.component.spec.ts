import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTypeComponent } from './JobType.component';

describe('JobtypeComponent', () => {
  let component: JobTypeComponent;
  let fixture: ComponentFixture<JobTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
