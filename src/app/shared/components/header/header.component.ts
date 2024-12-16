import { Component, input, output, type OnInit } from '@angular/core';
import { User } from '../../services/users.service';

@Component({
  selector: 'header[main-header]',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  host:{
    class:'dashboard-header'
  }
})
export class HeaderComponent implements OnInit {

  user = input.required<User|null>();
  toggleSidebarEmitter = output({alias: 'toggle-sidebar'});
  logoutEmitter = output<void>({alias: 'logout'});

  ngOnInit(): void { }

  toggleSidebar(){
    this.toggleSidebarEmitter.emit();
  }

  logout(): void {
    this.logoutEmitter.emit();
  }
}
