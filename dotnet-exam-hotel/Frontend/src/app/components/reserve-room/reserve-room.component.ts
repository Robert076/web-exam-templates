import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelRoomService } from '../../services/hotel-room.service';
import { ReservationService, Reservation } from '../../services/reservation.service';
import { HotelRoom } from '../../models/hotel-room.model';

@Component({
  selector: 'app-reserve-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserve-room.component.html',
  styleUrls: ['./reserve-room.component.scss']
})
export class ReserveRoomComponent {
  rooms: HotelRoom[] = [];
  selectedRoomId: number | null = null;
  checkInDate = '';
  checkOutDate = '';
  numberOfGuests = 1;
  totalPrice: number | null = null;
  showConfirm = false;
  error = '';
  success = '';

  constructor(
    private hotelRoomService: HotelRoomService,
    private reservationService: ReservationService,
    private router: Router
  ) {
    this.hotelRoomService.getRooms().subscribe({
      next: (rooms) => (this.rooms = rooms),
      error: () => (this.error = 'Failed to load rooms.')
    });
  }

  calculatePrice() {
    const room = this.rooms.find(r => r.id === this.selectedRoomId);
    if (!room || !this.checkInDate || !this.checkOutDate) return null;
    const days = (new Date(this.checkOutDate).getTime() - new Date(this.checkInDate).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, days) * room.basePrice;
  }

  openConfirm() {
    this.error = '';
    if (!this.selectedRoomId || !this.checkInDate || !this.checkOutDate) {
      this.error = 'Please fill all fields.';
      return;
    }
    this.totalPrice = this.calculatePrice();
    this.showConfirm = true;
  }

  confirmReservation() {
    if (!this.selectedRoomId || !this.checkInDate || !this.checkOutDate || !this.totalPrice) return;
    const reservation: Reservation = {
      roomId: this.selectedRoomId,
      numberOfGuests: this.numberOfGuests,
      totalPrice: this.totalPrice,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate
    };
    this.reservationService.addReservation(reservation).subscribe({
      next: () => {
        this.success = 'Reservation confirmed!';
        this.showConfirm = false;
        setTimeout(() => this.router.navigate(['/my-reservations']), 1200);
      },
      error: (err) => {
        this.error = err.error?.message || 'Reservation failed.';
        this.showConfirm = false;
      }
    });
  }

  cancelConfirm() {
    this.showConfirm = false;
  }

  getSelectedRoomNumber(): number | null {
    const room = this.rooms.find(r => r.id === this.selectedRoomId);
    return room ? room.roomNumber : null;
  }
} 