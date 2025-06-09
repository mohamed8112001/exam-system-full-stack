import { Routes } from '@angular/router';
import { ExamsComponent } from './exams/exams.component';
import { ExamComponent } from './exam/exam.component';
import { ResultsComponent } from './results/results.component';

export const STUDENT_ROUTES: Routes = [
  { path: '', redirectTo: 'exams', pathMatch: 'full' },
  { path: 'exams', component: ExamsComponent },
  { path: 'exams/:id', component: ExamComponent },
  { path: 'results', component: ResultsComponent }
];