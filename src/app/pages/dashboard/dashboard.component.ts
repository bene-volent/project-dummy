import { Component, ElementRef, inject, Signal, signal, viewChild } from '@angular/core';
import { User, UsersService } from '../../shared/services/users.service';
import {CarouselModule} from 'ngx-bootstrap/carousel'

@Component({
  selector: 'app-dashboard',
  imports: [CarouselModule,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent { 
  
  usersService = inject(UsersService)
  user: Signal<User | null> = signal(null);

  sidebar = viewChild<ElementRef<HTMLElement>>('sidebar')

  slides = Array.from({length: 4}, (_, i) => ({
    image: `https://placehold.co/600x400/666666/ffffff/png?text=Placeholder+Image+${i}`,
    text: `Slide ${i}`,
    subtitle: `Subtitle ${i}`
  }))

  slidesConfig = {
    interval: 5000,
    pauseOnHover: true,
    showIndicators: false,
  }

  ngOnInit(){
    this.user = this.usersService.user$$
    console.log(this.slides)
  }

  logout(){
    this.usersService.logout()
  }

  toggleSidebar(e:EventTarget){
    const button = e as HTMLButtonElement
    this.sidebar()!.nativeElement.classList.toggle('active')
    // console.log(this.sidebar()!.nativeElement)
  }
}
