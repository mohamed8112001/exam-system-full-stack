import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { SubmissionService } from '../../core/services/submission.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  totalExams = 0;
  totalStudents = 0;
  totalSubmissions = 0;
  loading = false;

  constructor(
    private examService: ExamService,
    private submissionService: SubmissionService
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;

    // Load total exams
    this.examService.getExams().subscribe({
      next: (response) => {
        this.totalExams = response.data.length;
      },
      error: (error) => {
        console.error('Error loading exams:', error);
      }
    });

    // Load total submissions (this will give us an idea of student activity)
    this.submissionService.getStudentResults().subscribe({
      next: (response) => {
        this.totalSubmissions = response.data.length;
        // Count unique students from submissions
        const uniqueStudents = new Set(response.data.map((submission: any) => submission.student_id));
        this.totalStudents = uniqueStudents.size;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading submissions:', error);
        this.loading = false;
      }
    });
  }

  refreshStats(): void {
    this.loadDashboardStats();
  }
}
