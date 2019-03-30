import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsriSceneComponent } from './esri-scene.component';

describe('EsriSceneComponent', () => {
  let component: EsriSceneComponent;
  let fixture: ComponentFixture<EsriSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsriSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsriSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
