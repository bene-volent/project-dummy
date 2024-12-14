import { Component, inject,DestroyRef } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { User, UsersService } from './shared/services/users.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  usersService = inject(UsersService)
  router = inject(Router)
  destroyRef = inject(DestroyRef)
  activatedRoute  = inject(ActivatedRoute)
  user: User | null = null

  constructor() {
    const subscription = this.usersService.user$.subscribe({
      next: (user) => {
        this.user = user
      }
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    })
  }

}
