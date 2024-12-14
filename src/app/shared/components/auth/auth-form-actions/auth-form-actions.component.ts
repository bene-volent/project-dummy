import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form-actions',
  standalone:false,
  templateUrl: './auth-form-actions.component.html',
  styleUrl: './auth-form-actions.component.css'
})
export class AuthFormActionsComponent {
  @Input({required:true}) actions: { text: string, link: string }[] = [];
}
