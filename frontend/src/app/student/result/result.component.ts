import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './result.component.html',
})
export class ResultComponent {
  score: number = 0;
  total: number = 0;
  percentage: number = 0;

  ngOnInit(): void {
    const nav = history.state;
    this.score = nav.score || 0;
    this.total = nav.total || 0;
    this.percentage = nav.percentage || 0;
  }
}
