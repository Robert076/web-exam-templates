import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelRoom } from '../models/hotel-room.model';

@Injectable({ providedIn: 'root' })
export class HotelRoomService {
  private apiUrl = '/api/rooms';

  constructor(private http: HttpClient) {}

  getRooms(): Observable<HotelRoom[]> {
    return this.http.get<HotelRoom[]>(this.apiUrl);
  }

  addRoom(room: HotelRoom): Observable<HotelRoom> {
    return this.http.post<HotelRoom>(this.apiUrl, room);
  }

  getAvailableRooms(checkIn: string, checkOut: string): Observable<HotelRoom[]> {
    return this.http.get<HotelRoom[]>(`${this.apiUrl}/available`, {
      params: { checkIn, checkOut }
    });
  }
} 