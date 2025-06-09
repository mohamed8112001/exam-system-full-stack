import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../shared/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit {
  results: any[] = [];
  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.loading = true;
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.http.get<any>('http://localhost:3001/api/submissions/results', { headers })
      .subscribe({
        next: (response) => {
          this.results = response.data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading results:', err);
          this.error = 'Failed to load your results. Please try again.';
          this.loading = false;
        }
      });
  }

  getPercentage(score: number, totalPoints: number): number {
    return Math.round((score / totalPoints) * 100);
  }

  getStatusClass(percentage: number): string {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }
}