import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationWrapperComponent } from './visualization-wrapper.component';

describe('VisualizationWrapperComponent', () => {
  let component: VisualizationWrapperComponent;
  let fixture: ComponentFixture<VisualizationWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
