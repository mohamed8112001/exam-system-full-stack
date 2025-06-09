import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.component.html'
})
export class ExamComponent implements OnInit {
  examId: string = '';
  exam: any = null;
  loading = true;
  error = '';
  answers: any[] = [];
  timeLeft: number = 0;
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    if (this.examId) {
      this.loadExam();
    } else {
      this.error = 'Invalid exam ID';
      this.loading = false;
    }
  }

  loadExam(): void {
    this.http.get<any>(`http://localhost:3001/api/exams/${this.examId}`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    }).subscribe({
      next: (response) => {
        this.exam = response.data;
        this.timeLeft = this.exam.duration_minutes * 60;
        this.startTimer();
        this.initializeAnswers();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading exam:', err);
        this.error = 'Failed to load exam. Please try again.';
        this.loading = false;
      }
    });
  }

  initializeAnswers(): void {
    this.answers = this.exam.questions.map((q: any) => ({
      question_id: q._id,
      selected_option_id: null,
      text_answer: ''
    }));
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.submitExam();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  submitExam(): void {
    clearInterval(this.timerInterval);
    
    this.http.post<any>(`http://localhost:3001/api/submissions/exams/${this.examId}/submit`, {
      answers: this.answers
    }, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    }).subscribe({
      next: (response) => {
        this.router.navigate(['/student/results']);
      },
      error: (err) => {
        console.error('Error submitting exam:', err);
        this.error = 'Failed to submit exam. Please try again.';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}