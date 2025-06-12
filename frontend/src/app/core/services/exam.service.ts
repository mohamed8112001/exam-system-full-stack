import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, retry, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Exam {
  _id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  questions: Question[];
  created_by: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  _id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'text';
  points: number;
  options?: Option[];
}

export interface Option {
  _id: string;
  option_text: string;
  is_correct?: boolean; // Only visible to admins
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  duration_minutes: number;
  questions: CreateQuestionRequest[];
}

export interface CreateQuestionRequest {
  question_text: string;
  question_type: 'multiple_choice' | 'text';
  points: number;
  options?: CreateOptionRequest[];
}

export interface CreateOptionRequest {
  option_text: string;
  is_correct: boolean;
}

export interface ExamListResponse {
  success: boolean;
  message: string;
  data: Exam[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ExamResponse {
  success: boolean;
  message: string;
  data: Exam;
}

export interface ExamStatistics {
  exam: {
    title: string;
    total_points: number;
    questions_count: number;
  };
  statistics: {
    total_submissions: number;
    average_score: number;
    highest_score: number;
    lowest_score: number;
    average_percentage: number;
  };
  submissions: Array<{
    student: {
      _id: string;
      username: string;
      email: string;
    };
    score: number;
    percentage: number;
    submitted_at: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private readonly baseUrl = `${environment.apiUrl}/exams`;
  private examsSubject = new BehaviorSubject<Exam[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public exams$ = this.examsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of exams
   */
  getExams(params: {
    page?: number;
    limit?: number;
    title?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Observable<ExamListResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<ExamListResponse>(this.baseUrl, { params: httpParams })
      .pipe(
        retry(2),
        map(response => {
          this.examsSubject.next(response.data);
          this.loadingSubject.next(false);
          return response;
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          this.errorSubject.next(error.error?.message || 'Failed to load exams');
          return throwError(() => error);
        }),
        shareReplay(1)
      );
  }

  /**
   * Get exam by ID
   */
  getExamById(id: string): Observable<ExamResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<ExamResponse>(`${this.baseUrl}/${id}`)
      .pipe(
        retry(2),
        map(response => {
          this.loadingSubject.next(false);
          return response;
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          this.errorSubject.next(error.error?.message || 'Failed to load exam');
          return throwError(() => error);
        })
      );
  }

  /**
   * Create new exam (Admin only)
   */
  createExam(examData: CreateExamRequest): Observable<ExamResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<ExamResponse>(this.baseUrl, examData)
      .pipe(
        map(response => {
          this.loadingSubject.next(false);
          // Refresh exams list
          this.refreshExams();
          return response;
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          this.errorSubject.next(error.error?.message || 'Failed to create exam');
          return throwError(() => error);
        })
      );
  }

  /**
   * Update exam (Admin only)
   */
  updateExam(id: string, examData: Partial<CreateExamRequest>): Observable<ExamResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.put<ExamResponse>(`${this.baseUrl}/${id}`, examData)
      .pipe(
        map(response => {
          this.loadingSubject.next(false);
          // Refresh exams list
          this.refreshExams();
          return response;
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          this.errorSubject.next(error.error?.message || 'Failed to update exam');
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete exam (Admin only)
   */
  deleteExam(id: string): Observable<any> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.delete(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => {
          this.loadingSubject.next(false);
          // Refresh exams list
          this.refreshExams();
          return response;
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          this.errorSubject.next(error.error?.message || 'Failed to delete exam');
          return throwError(() => error);
        })
      );
  }

  /**
   * Get exam statistics (Admin only)
   */
  getExamStatistics(id: string): Observable<{ success: boolean; data: ExamStatistics }> {
    return this.http.get<{ success: boolean; data: ExamStatistics }>(`${this.baseUrl}/${id}/statistics`)
      .pipe(
        retry(2),
        catchError(error => {
          this.errorSubject.next(error.error?.message || 'Failed to load statistics');
          return throwError(() => error);
        })
      );
  }

  /**
   * Refresh exams list
   */
  private refreshExams(): void {
    this.getExams().subscribe();
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
    this.examsSubject.next([]);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
  }
}
