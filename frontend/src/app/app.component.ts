
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ExamComponent } from './student/exam/exam.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ExamComponent ,FooterComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// export class AppComponent {
//   title = 'frontend';
// }

export class AppComponent implements OnInit {
  title = 'frontend';

  ngOnInit(): void {
    initFlowbite();
  }
}