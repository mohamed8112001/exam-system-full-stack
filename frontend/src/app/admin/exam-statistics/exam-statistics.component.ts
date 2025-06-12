import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';

@Component({
  selector: 'app-exam-statistics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-statistics.component.html',
  styleUrls: ['./exam-statistics.component.css']
})
export class ExamStatisticsComponent implements OnInit {
  examId: string = '';
  statistics: any = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.examId = params['id'];
      if (this.examId) {
        this.loadStatistics();
      }
    });
  }

  loadStatistics(): void {
    this.loading = true;
    this.error = null;

    this.examService.getExamStatistics(this.examId).subscribe({
      next: (response: any) => {
        this.statistics = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load exam statistics';
        this.loading = false;
        console.error('Error loading statistics:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/exams']);
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

  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }
}
