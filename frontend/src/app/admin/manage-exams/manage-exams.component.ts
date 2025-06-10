import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-exams',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './manage-exams.component.html'
})
export class ManageExamsComponent {
  exams: any[] = [];
  loading = false;
  error = '';
  success = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.http.get<any>('http://localhost:3001/api/exams', {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: (res) => {
        this.exams = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load exams';
        this.loading = false;
      }
    });
  }

  createExam(): void {
    const exam = {
      title: 'Sample Exam',
      duration_minutes: 60,
      questions: []
    };
    this.loading = true;
    this.http.post<any>('http://localhost:3001/api/exams', exam, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: (res) => {
        this.success = 'Exam created successfully!';
        this.loadExams();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create exam';
        this.loading = false;
      }
    });
  }
}