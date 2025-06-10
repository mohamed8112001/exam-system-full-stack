import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-exams',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-exams.component.html'
})
export class ManageExamsComponent implements OnInit {
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

  deleteExam(id: string): void {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    this.http.delete<any>(`http://localhost:3001/api/exams/${id}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: () => {
        this.success = 'Exam deleted successfully!';
        this.loadExams();
      },
      error: () => {
        this.error = 'Failed to delete exam';
      }
    });
  }
}