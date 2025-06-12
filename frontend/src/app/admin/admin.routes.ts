import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamStatisticsComponent } from './exam-statistics/exam-statistics.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'exams', component: ExamsComponent },
  { path: 'exams/create', component: ExamsComponent },
  { path: 'exams/:id/edit', component: ExamsComponent },
  { path: 'exams/:id/statistics', component: ExamStatisticsComponent }
];





