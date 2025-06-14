import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {
  // Create exam form
  title = '';
  description = '';
  duration_minutes: number = 60;
  questions: any[] = [];
  success = '';
  error = '';
  loading = false;

  // Exam management
  exams: any[] = [];
  showCreateForm = false;
  editingExam: any = null;
  loadingExams = false;
  examError = '';
  isEditMode = false;
  examIdToEdit: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.examIdToEdit = params['id'];
        this.isEditMode = true;
        this.showCreateForm = true;
        this.loadExamForEdit(params['id']);
      } else {
        this.isEditMode = false;
        this.examIdToEdit = null;
      }
    });

    this.loadExams();
  }

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

  loadExams(): void {
    this.loadingExams = true;
    this.examError = '';

    this.examService.getExams().subscribe({
      next: (response) => {
        this.exams = response.data;
        this.loadingExams = false;
      },
      error: (error) => {
        this.examError = 'Failed to load exams';
        this.loadingExams = false;
        console.error('Error loading exams:', error);
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.duration_minutes = 60;
    this.questions = [];
    this.success = '';
    this.error = '';
    this.editingExam = null;
  }

  loadExamForEdit(examId: string): void {
    this.examService.getExamById(examId).subscribe({
      next: (response: any) => {
        const exam = response.data;
        this.editingExam = exam;
        this.title = exam.title;
        this.description = exam.description || '';
        this.duration_minutes = exam.duration_minutes;
        this.questions = [...exam.questions];
      },
      error: (error: any) => {
        this.error = 'Failed to load exam for editing';
        console.error('Error loading exam:', error);
      }
    });
  }

  editExam(exam: any): void {
    this.router.navigate(['/admin/exams', exam._id, 'edit']);
  }

  deleteExam(examId: string): void {
    if (confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          this.success = 'Exam deleted successfully!';
          this.loadExams(); // Reload the list
        },
        error: (error) => {
          this.error = 'Failed to delete exam';
          console.error('Error deleting exam:', error);
        }
      });
    }
  }

  createExam() {
    this.loading = true;
    this.success = '';
    this.error = '';

    const examData = {
      title: this.title,
      description: this.description,
      duration_minutes: this.duration_minutes,
      questions: this.questions
    };

    if (this.isEditMode && this.examIdToEdit) {
      // Update existing exam
      this.examService.updateExam(this.examIdToEdit, examData).subscribe({
        next: () => {
          this.success = 'Exam updated successfully!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/admin/exams']);
          }, 1500);
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to update exam';
          this.loading = false;
        }
      });
    } else {
      // Create new exam
      this.examService.createExam(examData).subscribe({
        next: () => {
          this.success = 'Exam created successfully!';
          this.loading = false;
          this.showCreateForm = false;
          this.loadExams();
          this.resetForm();
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to create exam';
          this.loading = false;
        }
      });
    }
  }

  viewExamStatistics(examId: string): void {
    this.router.navigate(['/admin/exams', examId, 'statistics']);
  }
}