import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

const API_URL = `${environment.apiBaseUrl}/books`;
const IMG_URL = `${environment.apiUrlForImgs}`;

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = API_URL;

  constructor(private http: HttpClient) {}

  getBooks(filters: any, page: number, limit: number): Observable<{ data: { books: Book[] } }> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
  
    // Categories
    if (filters.categories?.length) {
      params = params.set('category', filters.categories.join(','));
    }
  
    // Authors
    if (filters.authors?.length) {
      params = params.set('author', filters.authors.join(','));
    }
    
    // Rating
    if (filters.rating) {
      params = params.set('rating', filters.rating.toString());
    }
  
    // Price Range
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        params = params.set('minPrice', filters.priceRange.min.toString());
      }
      if (filters.priceRange.max !== undefined) {
        params = params.set('maxPrice', filters.priceRange.max.toString());
      }
    }
  
    return this.http.get<any>(`${this.apiUrl}`, { params }).pipe(
      map(res => {
        const mappedBooks: Book[] = res.data.books.map((book: any) => ({
          id: book._id,
          title: book.title,
          author: book.author,
          description: book.description,
          isbn: book.isbn,
          price: book.price,
          discount: book.discount,
          pages: book.pages,
          category: book.category,
          coverImage: IMG_URL + (book.coverImage || book.coverImageUrl),
          images: book.images,
          stock: book.stock,
          rating: book.averageRating,
          totalReviews: book.totalReviews,
          totalSales: book.totalSales,
          isNew: book.isNew,
          isBestseller: book.isBestseller,
          isFeatured: book.isFeatured,
          createdAt: book.createdAt,
          updatedAt: book.updatedAt,
        }));
        return { data: { books: mappedBooks } };
      })
    );
  }
  
  // getBooks(filters: any, page: number, limit: number): Observable<{ data: { books: Book[] } }> {
  //   let params = new HttpParams()
  //     .set('page', page)
  //     .set('limit', limit);

  //   Object.keys(filters).forEach(key => {
  //     if (filters[key]) {
  //       params = params.set(key, filters[key]);
  //     }
  //   });

  //   return this.http.get<any>(`${this.apiUrl}`, { params }).pipe(
  //     map(res => {
  //       const mappedBooks: Book[] = res.data.books.map((book: any) => ({
  //         id: book._id,
  //         title: book.title,
  //         author: book.author,
  //         description: book.description,
  //         isbn: book.isbn,
  //         price: book.price,
  //         discount: book.discount,
  //         pages: book.pages,
  //         category: book.category,
  //         coverImage: IMG_URL + book.coverImage || book.coverImageUrl,
  //         images: book.images,
  //         stock: book.stock,
  //         rating: book.averageRating,
  //         totalReviews: book.totalReviews,
  //         totalSales: book.totalSales,
  //         isNew: book.isNew,
  //         isBestseller: book.isBestseller,
  //         isFeatured: book.isFeatured,
  //         createdAt: book.createdAt,
  //         updatedAt: book.updatedAt,
  //       }));
  //       return { data: { books: mappedBooks } };
  //     })
  //   );
  // }
}
