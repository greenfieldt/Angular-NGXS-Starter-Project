import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurworkComponent } from './ourwork.component';

describe('OurworkComponent', () => {
  let component: OurworkComponent;
  let fixture: ComponentFixture<OurworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
