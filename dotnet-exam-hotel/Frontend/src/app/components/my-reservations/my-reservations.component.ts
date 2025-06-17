import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService, Reservation } from '../../services/reservation.service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss']
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = false;
  error = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.loading = true;
    this.reservationService.getMyReservations().subscribe({
      next: (res) => {
        this.reservations = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load reservations.';
        this.loading = false;
      }
    });
  }
} 