import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  id?: number;
  roomId: number;
  userId?: number;
  numberOfGuests: number;
  totalPrice: number;
  checkInDate: string;
  checkOutDate: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = '/api/reservations';

  constructor(private http: HttpClient) {}

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  getMyReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }
} 