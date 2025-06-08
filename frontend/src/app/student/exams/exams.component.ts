import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-exams',
  imports: [CommonModule , RouterLink],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css'
})
export class ExamsComponent {
  constructor(private router: Router) { }

  exams = [
    {
      id: 1,
      title: 'Math Exam',
      startTime: new Date('2025-06-09T10:00:00'),
      endTime: new Date('2025-06-09T11:00:00'),
    },
    {
      id: 2,
      title: 'Physics Exam',
      startTime: new Date('2025-06-10T15:00:00'),
      endTime: new Date('2025-06-10T16:00:00'),
    },
    {
      id: 3,
      title: 'English Exam',
      startTime: new Date('2025-06-08T04:00:00'),
      endTime: new Date('2025-06-08T10:00:00'),
    },
    {
      id: 3,
      title: 'History Exam',
      startTime: new Date('2025-06-08T08:00:00'),
      endTime: new Date('2025-06-08T10:00:00'),
    },
  ];

  now = new Date();

  canTakeExam(exam: any): boolean {
    return this.now >= exam.startTime && this.now <= exam.endTime;
  }

  goToExam(exam: any) {
    if (this.canTakeExam(exam)) {
      this.router.navigate(['/student/exams', exam.id]);
    } else {
      alert('هذا الامتحان غير متاح في الوقت الحالي');
    }
  }

}
