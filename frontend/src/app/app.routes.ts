import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
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
  { path: '**', redirectTo: '/login' }
];
