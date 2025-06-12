import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../auth.service';

interface User {
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  isLoggedIn = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.user = user;
      this.isLoggedIn = !!user;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  navigateToDashboard(): void {
    if (this.user?.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.user?.role === 'student') {
      this.router.navigate(['/student/exams']);
    }
  }
}
