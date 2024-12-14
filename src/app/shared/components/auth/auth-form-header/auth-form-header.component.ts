import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form-header',
  templateUrl: './auth-form-header.component.html',
  standalone:false,
})
export class AuthFormHeaderComponent {
  @Input({required:true}) companyName: string = 'Company Logo';
  @Input({required:true}) linkText: string = 'Second';
  @Input({required:true}) linkUrl: string = '#';
}
