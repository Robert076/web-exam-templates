import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelRoom } from '../../models/hotel-room.model';
import { HotelRoomService } from '../../services/hotel-room.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
  rooms: HotelRoom[] = [];
  newRoom: HotelRoom = { roomNumber: 0, basePrice: 0, capacity: 1 };
  loading = false;
  error = '';
  checkInDate: string = '';
  checkOutDate: string = '';

  constructor(private hotelRoomService: HotelRoomService) {}

  ngOnInit() {
    this.fetchRooms();
  }

  fetchRooms() {
    this.loading = true;
    this.hotelRoomService.getRooms().subscribe({
      next: (rooms: HotelRoom[]) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: (_err: any) => {
        this.error = 'Failed to load rooms.';
        this.loading = false;
      }
    });
  }

  addRoom() {
    this.hotelRoomService.addRoom(this.newRoom).subscribe({
      next: (room: HotelRoom) => {
        this.rooms.push(room);
        this.newRoom = { roomNumber: 0, basePrice: 0, capacity: 1 };
      },
      error: (_err: any) => {
        this.error = 'Failed to add room.';
      }
    });
  }

  filterAvailableRooms() {
    if (!this.checkInDate || !this.checkOutDate) {
      this.error = 'Please select both check-in and check-out dates.';
      return;
    }
    this.loading = true;
    this.hotelRoomService.getAvailableRooms(this.checkInDate, this.checkOutDate).subscribe({
      next: (rooms: HotelRoom[]) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: (_err: any) => {
        this.error = 'Failed to load available rooms.';
        this.loading = false;
      }
    });
  }
} 