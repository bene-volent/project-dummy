import { Component, ElementRef, inject, Signal, signal, viewChild } from '@angular/core';
import { User, UsersService } from '../../shared/services/users.service';
import { CarouselModule } from 'ngx-bootstrap/carousel'
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { CardsSectionComponent } from './components/cards-section/cards-section.component';
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { ModalService } from '../../shared/services/modal.service';
import { ContentModalComponent } from './components/content-modal/content-modal.component';

@Component({
  selector: 'app-dashboard',
  imports: [CarouselModule, HeaderComponent, SidebarComponent, CardsSectionComponent, MatCardModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

  usersService = inject(UsersService)
  modalService = inject(ModalService)

  user: Signal<User | null> = signal(null);

  sidebar = viewChild(SidebarComponent)

  slides = Array.from({ length: 4 }, (_, i) => ({
    image: `https://placehold.co/600x400/666666/ffffff/png?text=Placeholder+Image+${i}`,
    text: `Slide ${i}`,
    subtitle: `Subtitle ${i}`
  }))

  slidesConfig = {
    interval: 5000,
    pauseOnHover: true,
    showIndicators: false,
  }


  sections = [
    {
      title: 'Mathematics',
      topics: [
        {
          id: 'MAT1',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Mathematics',
          topic: 'Algebra',
          description: 'Introduction to algebraic concepts',
          detailedDescription: 'This section covers the basics of algebra including variables, equations, and functions. It provides a comprehensive overview of algebraic principles and their applications in solving real-world problems.',
          isEnrolled: true
        },
        {
          id: 'MAT2',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Mathematics',
          topic: 'Geometry',
          description: 'Basics of shapes and figures',
          detailedDescription: 'This section introduces the study of shapes, sizes, and the properties of space. It covers fundamental concepts of geometry including points, lines, angles, and various geometric figures.',
          isEnrolled: false
        },
        {
          id: 'MAT3',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Mathematics',
          topic: 'Calculus',
          description: 'Introduction to calculus',
          detailedDescription: 'This section covers the basics of calculus including limits, derivatives, and integrals. It provides a comprehensive overview of calculus principles and their applications in solving real-world problems.',
          isEnrolled: true
        }
      ]
    },
    {
      title: 'Science',
      topics: [
        {
          id: 'SCI1',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Science',
          topic: 'Physics',
          description: 'Fundamentals of motion and forces',
          detailedDescription: 'Explore the principles of motion, force, and energy in this comprehensive physics section. It delves into the laws of physics that govern the natural world and their practical implications.',
          isEnrolled: false
        },
        {
          id: 'SCI2',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Science',
          topic: 'Biology',
          description: 'Introduction to living organisms',
          detailedDescription: 'This section covers the basics of biology including the study of living organisms, their structures, functions, and interactions with the environment.',
          isEnrolled: true
        },
        {
          id: 'SCI3',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Science',
          topic: 'Chemistry',
          description: 'Basics of matter and its properties',
          detailedDescription: 'This section introduces the study of matter, its properties, and the changes it undergoes. It covers fundamental concepts of chemistry including elements, compounds, and chemical reactions.',
          isEnrolled: false
        },
        {
          id: 'SCI4',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Science',
          topic: 'Astronomy',
          description: 'Introduction to astronomy',
          detailedDescription: 'This section covers the basics of astronomy including the study of celestial objects, space, and the universe as a whole. It provides an overview of astronomical concepts and their significance.',
          isEnrolled: true
        }
      ]
    },
    {
      title: 'Social Science',
      topics: [
        {
          id: 'SOC1',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Social Science',
          topic: 'History',
          description: 'Ancient Indian History',
          detailedDescription: 'Learn about the development of ancient Indian civilizations, their cultures, and contributions to the modern world. This section offers a detailed exploration of early Indian societies and their lasting impacts.',
          isEnrolled: false
        },
        {
          id: 'SOC2',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Social Science',
          topic: 'Geography',
          description: 'Introduction to physical geography',
          detailedDescription: 'This section covers the basics of physical geography including the study of landforms, climates, and ecosystems. It provides an overview of the physical features of the Earth and their significance.',
          isEnrolled: true
        },
        {
          id: 'SOC3',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Social Science',
          topic: 'Civics',
          description: 'Basics of Indian political system',
          detailedDescription: 'This section introduces the study of civics including the structure and functions of the Indian government, the Constitution, and the rights and duties of citizens.',
          isEnrolled: false
        },
        {
          id: 'SOC4',
          thumbnail: 'https://placehold.co/100x100',
          subject: 'Social Science',
          topic: 'Economics',
          description: 'Introduction to economics',
          detailedDescription: 'This section covers the basics of economics including the study of production, consumption, and distribution of goods and services. It provides an overview of economic principles and their applications.',
          isEnrolled: true
        }
      ]
    }
  ]



  ngOnInit() {
    this.user = this.usersService.user$$
    console.log(this.slides)
  }

  logout() {
    this.usersService.logout()
  }

  toggleSidebar() {
    this.sidebar()?.toggleSidebar()
  }

  openContentModal(content?: any) {
    if (content) {
      console.log('Selected Content:', content)
    }
    const dialogRef = this.modalService.open(ContentModalComponent, {
      data: content,
    });
  }
}
