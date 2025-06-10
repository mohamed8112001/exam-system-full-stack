import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent {
  title = '';
  description = '';
  duration_minutes: number = 60;
  questions: any[] = [];
  success = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  addQuestion() {
    this.questions.push({
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      options: [{ option_text: '', is_correct: false }]
    });
  }

  removeQuestion(i: number) {
    this.questions.splice(i, 1);
  }

  addOption(q: any) {
    q.options.push({ option_text: '', is_correct: false });
  }

  removeOption(q: any, i: number) {
    q.options.splice(i, 1);
  }

  createExam() {
    this.loading = true;
    this.success = '';
    this.error = '';
    this.authService.createExam({
      title: this.title,
      description: this.description,
      duration_minutes: this.duration_minutes,
      questions: this.questions
    }).subscribe({
      next: () => {
        this.success = 'Exam created successfully!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/admin/exams']), 1200);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create exam';
        this.loading = false;
      }
    });
  }
}