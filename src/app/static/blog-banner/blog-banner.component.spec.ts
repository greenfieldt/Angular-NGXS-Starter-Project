import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogBannerComponent } from './blog-banner.component';

describe('BlogBannerComponent', () => {
  let component: BlogBannerComponent;
  let fixture: ComponentFixture<BlogBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
