import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksService } from '../../services/books.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-slider.component.html',
  styleUrls: ['./book-slider.component.css']
})
export class BookSliderComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  currentSlide = 0;
  slideWidth = 16.666; 
  intervalId: any;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.booksService.getBooks().subscribe(res => {
      this.books = res;

      if (this.books.length > 0) {
        this.intervalId = setInterval(() => {
          this.nextSlide();
        }, 3000);
      }
    });
  }

  nextSlide(): void {
    this.currentSlide++;

    if (this.currentSlide >= this.getMaxSlide()) {
      const track = document.querySelector('.auto-slider-track') as HTMLElement;
      if (track) {
        track.style.transition = 'none';
        this.currentSlide = 0;
        track.style.transform = 'translateX(0)';
        setTimeout(() => {
          track.style.transition = 'transform 0.8s ease-in-out';
        }, 50);
      }
    }
  }

  getMaxSlide(): number {
    const visibleCards = Math.floor(100 / this.slideWidth);
    return Math.max(1, this.books.length - visibleCards + 1);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
