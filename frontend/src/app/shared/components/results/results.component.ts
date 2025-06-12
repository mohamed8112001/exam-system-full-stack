import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { SubmissionService } from '../../../core/services/submission.service';
import { ExamService } from '../../../core/services/exam.service';

interface User {
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  user: User | null = null;
  results: any[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;

  constructor(
    private authService: AuthService,
    private submissionService: SubmissionService,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.user = user;
      if (user) {
        this.loadResults();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  loadResults(): void {
    if (!this.user) return;

    this.loading = true;
    this.error = null;

    if (this.user.role === 'student') {
      this.loadStudentResults();
    } else if (this.user.role === 'admin') {
      this.loadAdminResults();
    }
  }

  loadStudentResults(): void {
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

  loadAdminResults(): void {
    // For admin, we'll load all exams and their statistics
    this.examService.getExams({ page: this.currentPage, limit: 10 })
      .subscribe({
        next: (response) => {
          this.results = response.data.map(exam => ({
            exam: {
              id: exam._id,
              title: exam.title,
              description: exam.description,
              created_at: exam.createdAt
            },
            type: 'exam'
          }));
          this.totalPages = response.pagination?.pages || 1;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load exam results';
          this.loading = false;
          console.error('Error loading admin results:', error);
        }
      });
  }

  viewExamStatistics(examId: string): void {
    this.router.navigate(['/admin/exams', examId, 'statistics']);
  }

  viewSubmissionDetails(submissionId: string): void {
    this.router.navigate(['/student/submissions', submissionId]);
  }

  retakeExam(examId: string): void {
    this.router.navigate(['/student/exams', examId]);
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

  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getScoreBadgeColor(percentage: number): string {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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
