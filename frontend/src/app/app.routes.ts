import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './shared/components/home/home.component';
import { ResultsComponent } from './shared/components/results/results.component';
import { AboutComponent } from './shared/components/about/about.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'results',
    component: ResultsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.routes').then(m => m.STUDENT_ROUTES),
    canActivate: [authGuard],
    data: { role: 'student' }
  },
  { path: '**', redirectTo: '/home' }
];
