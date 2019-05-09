import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamichomeComponent } from './dynamichome.component';

describe('DynamichomeComponent', () => {
  let component: DynamichomeComponent;
  let fixture: ComponentFixture<DynamichomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamichomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamichomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
