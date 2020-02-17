import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { usersTimeSheetComponent } from './usersTimeSheet.component';

describe('usersTimeSheetComponent', () => {
  let component: usersTimeSheetComponent;
  let fixture: ComponentFixture<usersTimeSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ usersTimeSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(usersTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
