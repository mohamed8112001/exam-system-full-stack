import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// import{ExamResultService} from '../result/exam-result.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-exam',
  imports: [CommonModule, FormsModule,],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css'
})
export class ExamComponent implements OnInit {
  examId: number = 0;
  examQuestions: any[] = [];
  currentExam: any;
  exam: any = null;
  allExams = [
    {
      id: 1,
      Title:'Math exam',
      questions: [
        { q: 'What is 2 + 2?', options: ['2', '3', '4'], correct: '4' },
        { q: 'What is 3 * 3?', options: ['6', '9', '12'], correct: '9' }
      ]
    },
    {
      id: 3,
      Title:'English exam',
      questions: [
        { q: 'What is the synonym of "happy"?', options: ['Sad', 'Joyful', 'Angry'], correct: 'Joyful' },
        { q: 'What is the antonym of "big"?', options: ['Large', 'Small', 'Huge'], correct: 'Small' }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
  this.examId = +this.route.snapshot.paramMap.get('id')!;
  this.currentExam = this.allExams.find(e => e.id === this.examId);
  this.examQuestions = this.currentExam ? this.currentExam.questions : [];
}

  score: number | null = null;

  submitExam() {
  let correct = 0;
  for (let q of this.examQuestions) {
    if (q.selectedAnswer === q.correct) {
      correct++;
    }
  }
  this.score = correct;
  const percentage = (correct / this.examQuestions.length) * 100;
  this.router.navigate(['/result'], {
    state: {
      score: correct,
      total: this.examQuestions.length,
      percentage: percentage
    }
  });
  }

}