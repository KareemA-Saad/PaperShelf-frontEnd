import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookPagination } from '../interfaces/book';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

const API_URL = `${environment.apiBaseUrl}/users/admin`;
const IMG_URL = `${environment.apiUrlForImgs}`;

@Injectable({
  providedIn: 'root'
})

export class BookPendingService {

  private apiUrl = API_URL;

  constructor(private http: HttpClient) { }

  private mapBook(book: any): Book {
    return {
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
      averageRating: book.averageRating,
      totalReviews: book.totalReviews,
      totalSales: book.totalSales,
      isNew: book.isNew,
      isBestseller: book.isBestseller,
      isFeatured: book.isFeatured,
      isApproved: book.isApproved,
      pendingDelete: book.pendingDelete || false,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      reviews: book.reviews || []
    };
  }

  getBooks(filters: any, page: number, limit: number): Observable<{ data: { books: Book[], pagination: BookPagination } }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    if (filters.categories?.length) {
      params = params.set('category', filters.categories.join(','));
    }

    if (filters.authors?.length) {
      params = params.set('author', filters.authors.join(','));
    }
    if (filters.rating) {
      params = params.set('rating', filters.rating.toString());
    }
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        params = params.set('minPrice', filters.priceRange.min.toString());
      }
      if (filters.priceRange.max !== undefined) {
        params = params.set('maxPrice', filters.priceRange.max.toString());
      }
    }
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }
    if (filters.order) {
      params = params.set('order', filters.order);
    }

    return this.http.get<any>(`${this.apiUrl}/pending-books`, { params }).pipe(
      map(res => {
        const mappedBooks: Book[] = res.data.books.map((book: any) => this.mapBook(book));
        return { data: { books: mappedBooks, pagination: res.data.pagination } };
      })
    );
  }

  searchBooks(query: string, page: number = 1, limit: number = 20): Observable<{ data: { books: Book[], pagination: any } }> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}/search`, { params }).pipe(
      map(res => {
        const mappedBooks: Book[] = res.data.books.map((book: any) => this.mapBook(book));
        return { data: { books: mappedBooks, pagination: res.data.pagination } };
      })
    );
  }

  updateBook(id: string, data: any): Observable<any> {
    return this.http.put(`${environment.apiBaseUrl}/author/books/${id}`, data);
  }

  getFullImageUrl(path: string): string {
    if (!path) return '';
    return `${environment.apiUrlForImgs}${path}`;
  }

  deleteBook(bookId: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/author/books/${bookId}`);
  }
}
