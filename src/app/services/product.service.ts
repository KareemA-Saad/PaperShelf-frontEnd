import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  selected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/wishlist';

  constructor(private http: HttpClient) {}

  //  دالة بتجيب الهيدر اللي فيه التوكن
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken'); // تأكد إنه محفوظ عند الـ login
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  //  جلب قائمة الـ wishlist من الباك إند
  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<any>(this.baseUrl, this.getAuthHeaders()).pipe(
      map((response) =>
        response.data.map((book: any) => ({
          id: book._id,
          name: book.title,
          price: book.price,
          image: book.coverImage.startsWith('http')
            ? book.coverImage
            : `http://localhost:3000/${book.coverImage}`,
          inStock: book.stock > 0,
          selected: false,
        }))
      )
    );
  }

  //  إضافة كتاب للـ wishlist
  addToWishlist(bookId: string): Observable<any> {
    return this.http.post(this.baseUrl, { bookId }, this.getAuthHeaders());
  }

  //  حذف كتاب من الـ wishlist
  removeFromWishlist(bookId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${bookId}`, this.getAuthHeaders());
  }

  submitReview(bookId: string, review: any): Observable<any> {
    return this.http.post(
      `http://localhost:3000/api/reviews/${bookId}`,
      review,
      this.getAuthHeaders()
    );
  }

  //  Define a method to get the AI summary for a book
    getAISummary(bookId: string): Observable<string> {
      return this.http
        .get<{ summary: string }>(
          `http://localhost:3000/api/v1/books/${bookId}/formatted-summary`
        )
        .pipe(map((res) => res.summary || ''));
    }



}
