import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DinoLinearNetworkComponent } from './dino-linear-network.component';

describe('DinoLinearNetworkComponent', () => {
  let component: DinoLinearNetworkComponent;
  let fixture: ComponentFixture<DinoLinearNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DinoLinearNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinoLinearNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
