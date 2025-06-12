import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, interval, takeUntil, finalize } from 'rxjs';

import { ExamService, Exam } from '../../../core/services/exam.service';
import { SubmissionService, SubmissionAnswer } from '../../../core/services/submission.service';

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private examId!: string;
  private timerInterval?: any;

  exam$!: Observable<Exam | null>;
  loading$ = this.examService.loading$;
  error$ = this.examService.error$;

  examForm!: FormGroup;
  timeLeft = 0;
  timeLeftDisplay = '';
  isSubmitting = false;
  hasStarted = false;
  hasSubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private examService: ExamService,
    private submissionService: SubmissionService
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id')!;
    this.loadExam();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearTimer();
  }

  private loadExam(): void {
    this.examService.getExamById(this.examId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const exam = response.data;
          this.setupExamForm(exam);
          this.timeLeft = exam.duration_minutes * 60; // Convert to seconds
          this.updateTimeDisplay();
        },
        error: (error) => {
          console.error('Error loading exam:', error);
        }
      });
  }

  private setupExamForm(exam: Exam): void {
    const questionsArray = this.fb.array(
      exam.questions.map(question => {
        if (question.question_type === 'multiple_choice') {
          return this.fb.group({
            question_id: [question._id],
            selected_option_id: [null],
            text_answer: [null]
          });
        } else {
          return this.fb.group({
            question_id: [question._id],
            selected_option_id: [null],
            text_answer: ['']
          });
        }
      })
    );

    this.examForm = this.fb.group({
      answers: questionsArray
    });
  }

  get answersArray(): FormArray {
    return this.examForm.get('answers') as FormArray;
  }

  startExam(): void {
    this.hasStarted = true;
    this.startTimer();
  }

  private startTimer(): void {
    this.timerInterval = interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.timeLeft--;
        this.updateTimeDisplay();

        if (this.timeLeft <= 0) {
          this.submitExam(); // Auto-submit when time runs out
        }
      });
  }

  private updateTimeDisplay(): void {
    const hours = Math.floor(this.timeLeft / 3600);
    const minutes = Math.floor((this.timeLeft % 3600) / 60);
    const seconds = this.timeLeft % 60;

    this.timeLeftDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  submitExam(): void {
    if (this.isSubmitting || this.hasSubmitted) return;

    this.isSubmitting = true;
    this.clearTimer();

    const answers: SubmissionAnswer[] = this.examForm.value.answers.map((answer: any) => ({
      question_id: answer.question_id,
      selected_option_id: answer.selected_option_id || undefined,
      text_answer: answer.text_answer || undefined
    }));

    this.submissionService.submitExam(this.examId, answers)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.hasSubmitted = true;
          // Navigate to results page with submission data
          this.router.navigate(['/student/results'], {
            state: { 
              submissionResult: response.data,
              examId: this.examId
            }
          });
        },
        error: (error) => {
          console.error('Error submitting exam:', error);
          // Allow retry
          this.isSubmitting = false;
        }
      });
  }

  canSubmit(): boolean {
    return this.hasStarted && !this.isSubmitting && !this.hasSubmitted && this.examForm.valid;
  }

  getTimeLeftPercentage(): number {
    if (!this.exam$) return 100;
    
    // This would need to be calculated based on the original duration
    // For now, return a placeholder
    return Math.max(0, (this.timeLeft / (60 * 60)) * 100); // Assuming 1 hour max
  }

  isTimeRunningOut(): boolean {
    return this.timeLeft <= 300; // Last 5 minutes
  }

  confirmSubmit(): void {
    if (confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
      this.submitExam();
    }
  }

  goBack(): void {
    if (this.hasStarted && !this.hasSubmitted) {
      if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
        this.router.navigate(['/student/exams']);
      }
    } else {
      this.router.navigate(['/student/exams']);
    }
  }
}
