import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, WishlistItem } from '../services/product.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  selectedAction: string = '';
  allSelected: boolean = false;
  loading: boolean = true;
  error: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading = true;
    this.error = '';

    this.productService.getWishlist().subscribe({
      next: (products) => {
        this.wishlistItems = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.error = 'Failed to load wishlist. Please try again later.';
        this.loading = false;
      },
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    this.wishlistItems.forEach((item) => (item.selected = this.allSelected));
  }

  updateSelectAll(): void {
    this.allSelected = this.wishlistItems.every((item) => item.selected);
  }

  addToCart(item: WishlistItem): void {
    if (!item.inStock) {
      alert(`${item.name} is out of stock.`);
      return;
    }
    console.log(`Adding ${item.name} to cart`);
  }

  addSelectedToCart(): void {
    const selectedItems = this.wishlistItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      alert('Please select at least one item.');
      return;
    }
    console.log('Adding selected items to cart:', selectedItems);
  }

  addAllToCart(): void {
    const inStockItems = this.wishlistItems.filter((item) => item.inStock);
    if (inStockItems.length === 0) {
      alert('No items are currently in stock.');
      return;
    }
    console.log('Adding all in-stock items to cart:', inStockItems);
  }

  applyAction(): void {
    if (this.selectedAction === 'addToCart') {
      this.addSelectedToCart();
    }
    this.selectedAction = '';
  }

  readMore(item: WishlistItem): void {
    console.log(`Read more about ${item.name}`);
  }

  retryLoading(): void {
    this.loadWishlist();
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';
  }

  deleteItem(item: WishlistItem): void {
    this.productService.removeFromWishlist(item.id).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(
          (wishlistItem) => wishlistItem.id !== item.id
        );
        this.updateSelectAll();
      },
      error: (error) => {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item from wishlist.');
      },
    });
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProductService, WishlistItem } from '../services/product.service';

// @Component({
//   selector: 'app-wishlist',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './wishlist.component.html',
//   styleUrls: ['./wishlist.component.css'],
// })
// export class WishlistComponent implements OnInit {
//   wishlistItems: WishlistItem[] = [];
//   selectedAction: string = '';
//   allSelected: boolean = false;
//   loading: boolean = true;
//   error: string = '';

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.loadProducts();
//   }

//   loadProducts(): void {
//     this.loading = true;
//     this.error = '';

//     this.productService.getProducts().subscribe({
//       next: (products) => {
//         this.wishlistItems = products;
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error loading products:', error);
//         this.error = 'Failed to load products. Please try again later.';
//         this.loading = false;
//         this.loadFallbackData();
//       },
//     });
//   }

//   private loadFallbackData(): void {
//     this.wishlistItems = [
//       {
//         id: 1,
//         name: 'A Crooked Tree',
//         price: 26.0,
//         image: 'assets/images/crooked-tree.jpg',
//         inStock: true,
//         selected: false,
//       },
//       {
//         id: 2,
//         name: 'White Cat, Black Dog',
//         price: 34.0,
//         image: 'assets/images/white-cat-black-dog.jpg',
//         inStock: true,
//         selected: false,
//       },
//       {
//         id: 3,
//         name: 'Black Door',
//         price: 46.0,
//         image: 'assets/images/black-door.jpg',
//         inStock: false,
//         selected: false,
//       },
//     ];
//   }

//   toggleSelectAll(): void {
//     this.allSelected = !this.allSelected;
//     this.wishlistItems.forEach((item) => (item.selected = this.allSelected));
//   }

//   updateSelectAll(): void {
//     this.allSelected = this.wishlistItems.every((item) => item.selected);
//   }

//   addToCart(item: WishlistItem): void {
//     console.log(`Adding ${item.name} to cart`);
//     if (!item.inStock) {
//       alert(`${item.name} is currently out of stock.`);
//       return;
//     }
//   }

//   addSelectedToCart(): void {
//     const selectedItems = this.wishlistItems.filter((item) => item.selected);
//     if (selectedItems.length === 0) {
//       alert('Please select at least one item.');
//       return;
//     }
//     console.log('Adding selected items to cart:', selectedItems);
//   }

//   addAllToCart(): void {
//     const inStockItems = this.wishlistItems.filter((item) => item.inStock);
//     if (inStockItems.length === 0) {
//       alert('No items are currently in stock.');
//       return;
//     }
//     console.log('Adding all in-stock items to cart:', inStockItems);
//   }

//   applyAction(): void {
//     if (this.selectedAction === 'addToCart') {
//       this.addSelectedToCart();
//     }
//     this.selectedAction = '';
//   }

//   readMore(item: WishlistItem): void {
//     console.log(`Reading more about ${item.name}`);
//   }

//   retryLoading(): void {
//     this.loadProducts();
//   }

//   onImageError(event: Event): void {
//     const target = event.target as HTMLImageElement;
//     target.src = 'assets/images/placeholder.jpg';
//   }
//   deleteItem(item: WishlistItem): void {
//     console.log(`Deleting ${item.name} from wishlist`);
//     this.wishlistItems = this.wishlistItems.filter(
//       (wishlistItem) => wishlistItem.id !== item.id
//     );
//     this.updateSelectAll();
//   }
// }
