import { Component, input, output, signal, type OnInit } from '@angular/core';
import { User } from '../../services/users.service';

@Component({
  selector: 'aside[main-sidebar]',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  host:{
    class: `dashboard-sidebar`,
    '[class.active]':'isActive()'
  }
})
export class SidebarComponent implements OnInit {
user = input.required<User | null>();
toggleSidebarEmitter = output<EventTarget | null>({alias:'toggle-sidebar'})
isActive = signal(false)

toggleSidebar(){
  this.isActive.update(val=>!val)
}

  ngOnInit(): void { }

}
