import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSliderComponent } from './book-slider.component';

describe('BookSliderComponent', () => {
  let component: BookSliderComponent;
  let fixture: ComponentFixture<BookSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
