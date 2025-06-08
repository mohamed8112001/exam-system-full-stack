import { Component, OnInit } from '@angular/core';
import { ExamResultService } from '../result/exam-result.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
   imports: [CommonModule,],
   standalone: true,
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  previousResults: { title: string; score: number }[] = [];

  constructor(private resultService: ExamResultService) {}

  ngOnInit(): void {
    this.previousResults = this.resultService.getResults();
  }
}
