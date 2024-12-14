import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-auth-form-button',
  standalone:false,
  templateUrl: './auth-form-buttons.component.html',
  styleUrl: './auth-form-buttons.component.css'
})
export class AuthFormButtonComponent {
  @Input({required:true}) button!: { text: string, type: string, isSecondary: boolean};

}
