import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../interfaces/book';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: Book;
    getcart: any = { items: [], totalAmount: 0 };
  constructor(private cartService: CartService) {}
   loadCart() {
    this.cartService.getCart().subscribe(
      (response: any) => {
        this.getcart = response.data || { items: [], totalAmount: 0 };
      },
      (error) => {
        console.error('Error fetching cart items:', error);
        this.getcart = { items: [], totalAmount: 0 };
      }
    );
  }
  addToWishlist() {
    console.log('Added to wishlist:', this.book.id);
    // Add your wishlist logic here
  }

  addToCart() {
    this.cartService.addToCart(this.book.id).subscribe({
      next: (response) => {
        console.log('Added to cart:', this.book.id, response);
        this.loadCart(); // Reload the cart after adding an item
      },
      error: (error) => {
        console.error('Failed to add to cart', error);
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getDiscountedPrice(price: number, discount: number): number {
    return price - (price * discount / 100);
  }
}
