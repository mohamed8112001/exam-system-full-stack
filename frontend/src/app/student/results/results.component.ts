import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { SubmissionService } from '../../core/services/submission.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit {
  results: any[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  totalPages = 1;

  constructor(
    private authService: AuthService,
    private submissionService: SubmissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.loading = true;
    this.error = '';

    this.submissionService.getStudentResults({ page: this.currentPage, limit: 10 })
      .subscribe({
        next: (response) => {
          this.results = response.data;
          this.totalPages = response.pagination?.pages || 1;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load your results';
          this.loading = false;
          console.error('Error loading student results:', error);
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

  retakeExam(examId: string): void {
    this.router.navigate(['/student/exams', examId]);
  }

  viewSubmissionDetails(submissionId: string): void {
    this.router.navigate(['/student/submissions', submissionId]);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadResults();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadResults();
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}