import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExamResultService {
  private key = 'student_results';

  saveResult(title: string, score: number): void {
    const results = this.getResults();
    results.push({ title, score });
    localStorage.setItem(this.key, JSON.stringify(results));
  }

  getResults(): { title: string, score: number }[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  clearResults() {
    localStorage.removeItem(this.key);
  }
}
