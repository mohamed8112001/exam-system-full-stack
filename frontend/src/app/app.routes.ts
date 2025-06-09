import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ExamsComponent } from './student/exams/exams.component';
import { ExamComponent } from './student/exam/exam.component';
import { ResultComponent } from './student/result/result.component';
import { HomeComponent } from './student/home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageExamsComponent } from './admin/manage-exams/manage-exams.component';
import { ManageQuestionsComponent } from './admin/manage-questions/manage-questions.component';

export const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},

  { path: 'Home', component: HomeComponent },
  { path: 'student/exams', component: ExamsComponent },
  { path: 'student/exams/:id', component: ExamComponent },
  // { path: 'student/result', component: ResultComponent },
{
    path: 'result',
    loadComponent: () =>
      import('./student/result/result.component').then((m) => m.ResultComponent),
  },
  
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/exams', component: ManageExamsComponent },
  { path: 'admin/questions', component: ManageQuestionsComponent },

];
