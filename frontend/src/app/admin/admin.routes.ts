import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageExamsComponent , } from './manage-exams/manage-exams.component';
import { ManageQuestionsComponent } from './manage-questions/manage-questions.component';
import { ExamComponent } from '../student/exam/exam.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'exams', component: ManageExamsComponent },
  { path: 'questions', component: ManageQuestionsComponent },
  { path: 'exams/create', component: ExamComponent }, 

];





