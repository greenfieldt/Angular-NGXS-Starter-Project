import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayingWithTechComponent } from './playing-with-tech.component';

describe('PlayingWithTechComponent', () => {
  let component: PlayingWithTechComponent;
  let fixture: ComponentFixture<PlayingWithTechComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayingWithTechComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayingWithTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
