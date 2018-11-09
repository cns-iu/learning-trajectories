import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSelectorComponent } from './course-selector.component';

describe('CourseSelectorComponent', () => {
  let component: CourseSelectorComponent;
  let fixture: ComponentFixture<CourseSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
