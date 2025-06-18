import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface CreateOrderRequest {
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = '/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http
      .post<Order>(this.apiUrl, request, { withCredentials: true })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getUserOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(this.apiUrl, { withCredentials: true })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getOrderById(id: number): Observable<Order> {
    return this.http
      .get<Order>(`${this.apiUrl}/${id}`, { withCredentials: true })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (
        error.error &&
        typeof error.error === 'object' &&
        'message' in error.error
      ) {
        errorMessage = error.error.message as string;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 