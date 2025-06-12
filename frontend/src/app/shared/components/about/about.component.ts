import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  skills: string[];
  avatar: string;
  image: string;
  imageError?: boolean;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'Hamdy Salah',
      role: 'Backend Developer',
      description: 'Backend specialist with expertise in server-side development and some frontend experience. Works closely with the frontend team to ensure seamless integration.',
      skills: ['Node.js', 'Express.js', 'MongoDB', 'API Development', 'Database Design', 'Angular'],
      avatar: 'HS',
      image: 'hamdy.jpg'
    },
    {
      name: 'Mohamed Mustafa',
      role: 'Full-Stack Developer',
      description: 'Passionate about building end-to-end solutions with modern technologies and best practices.',
      skills: ['React', 'Node.js', 'Database Design', 'API Development', 'JavaScript', 'Python'],
      avatar: 'MM',
      image: 'mohamed.jpg'
    },
    {
      name: 'Mayar Mohamed',
      role: 'UI/UX & Front-End Developer',
      description: 'Creative designer and frontend developer focused on creating beautiful and intuitive user experiences. Collaborates closely with the backend team for optimal user interfaces.',
      skills: ['UI/UX Design', 'Angular', 'CSS3', 'HTML5', 'Figma', 'Adobe Creative Suite'],
      avatar: 'MY',
      image: 'mayar.jpg'
    }
  ];

  features = [
    {
      icon: '🎯',
      title: 'Easy Exam Creation',
      description: 'Create comprehensive exams with multiple question types and customizable settings.'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track student performance with detailed statistics and insights.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Built with security best practices to protect your data and ensure system reliability.'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Access the platform from any device with our mobile-friendly interface.'
    }
  ];

  onImageError(event: any, member: TeamMember): void {
    console.log(`Failed to load image for ${member.name} at path: ${member.image}`);

    // Try alternative paths
    if (!member.image.includes('/')) {
      // Try with assets path as fallback
      const altPath = `assets/images/${member.image}`;
      console.log(`Trying alternative path: ${altPath}`);
      (event.target as HTMLImageElement).src = altPath;
      return;
    }

    // If all paths fail, show fallback avatar
    member.imageError = true;
    console.log(`All image paths failed for ${member.name}, using fallback avatar`);
  }

  onImageLoad(member: TeamMember): void {
    console.log(`Successfully loaded image for ${member.name}`);
  }
}
