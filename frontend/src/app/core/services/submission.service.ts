import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, retry, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SubmissionAnswer {
  question_id: string;
  selected_option_id?: string;
  text_answer?: string;
}

export interface SubmitExamRequest {
  answers: SubmissionAnswer[];
}

export interface SubmissionResult {
  submission_id: string;
  score: number;
  total_points: number;
  percentage: number;
  detailed_results?: Array<{
    question_id: string;
    question_text: string;
    question_type: string;
    points: number;
    earned_points: number;
    is_correct: boolean;
    student_answer: SubmissionAnswer | null;
  }>;
}

export interface StudentResult {
  submission_id: string;
  exam: {
    id: string;
    title: string;
    duration_minutes: number;
  };
  score: number;
  total_points: number;
  percentage: number;
  submitted_at: string;
}

export interface ExamResults {
  exam: {
    id: string;
    title: string;
    total_points: number;
    questions_count: number;
  };
  results: Array<{
    submission_id: string;
    student: {
      id: string;
      username: string;
      email: string;
    };
    score: number;
    total_points: number;
    percentage: number;
    submitted_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SubmissionDetails {
  submission_id: string;
  exam: {
    id: string;
    title: string;
    description: string;
    duration_minutes: number;
  };
  student: {
    id: string;
    username: string;
    email: string;
  };
  score: number;
  total_points: number;
  percentage: number;
  submitted_at: string;
  answers: SubmissionAnswer[];
  questions: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private readonly baseUrl = `${environment.apiUrl}/submissions`;
  private resultsSubject = new BehaviorSubject<StudentResult[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public results$ = this.resultsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Submit exam answers
   */
  submitExam(examId: string, answers: SubmissionAnswer[]): Observable<{ success: boolean; data: SubmissionResult }> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const submitData: SubmitExamRequest = { answers };

    return this.http.post<{ success: boolean; data: SubmissionResult }>(
      `${this.baseUrl}/exams/${examId}/submit`, 
      submitData
    ).pipe(
      map(response => {
        this.loadingSubject.next(false);
        // Refresh student results
        this.refreshStudentResults();
        return response;
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.error?.message || 'Failed to submit exam');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get student's own results
   */
  getStudentResults(params: {
    page?: number;
    limit?: number;
  } = {}): Observable<{ success: boolean; data: StudentResult[]; pagination: any }> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<{ success: boolean; data: StudentResult[]; pagination: any }>(
      `${this.baseUrl}/results`, 
      { params: httpParams }
    ).pipe(
      retry(2),
      map(response => {
        this.resultsSubject.next(response.data);
        this.loadingSubject.next(false);
        return response;
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.error?.message || 'Failed to load results');
        return throwError(() => error);
      }),
      shareReplay(1)
    );
  }

  /**
   * Get exam results (Admin only)
   */
  getExamResults(examId: string, params: {
    page?: number;
    limit?: number;
  } = {}): Observable<{ success: boolean; data: ExamResults }> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<{ success: boolean; data: ExamResults }>(
      `${this.baseUrl}/exams/${examId}/results`,
      { params: httpParams }
    ).pipe(
      retry(2),
      catchError(error => {
        this.errorSubject.next(error.error?.message || 'Failed to load exam results');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get submission details
   */
  getSubmissionDetails(submissionId: string): Observable<{ success: boolean; data: SubmissionDetails }> {
    return this.http.get<{ success: boolean; data: SubmissionDetails }>(
      `${this.baseUrl}/${submissionId}`
    ).pipe(
      retry(2),
      catchError(error => {
        this.errorSubject.next(error.error?.message || 'Failed to load submission details');
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh student results
   */
  private refreshStudentResults(): void {
    this.getStudentResults().subscribe();
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Reset service state
   */
  reset(): void {
    this.resultsSubject.next([]);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
  }
}
