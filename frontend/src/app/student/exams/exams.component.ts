import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './exams.component.html'
})
export class ExamsComponent implements OnInit {
  exams: any[] = [];
  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    
    this.http.get<any>('http://localhost:3001/api/exams', {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    }).subscribe({
      next: (response) => {
        this.exams = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading exams:', err);
        this.error = 'Failed to load exams. Please try again.';
        this.loading = false;
      }
    });
  }
}