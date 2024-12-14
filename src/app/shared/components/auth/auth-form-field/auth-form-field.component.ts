import { Component, ContentChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-auth-form-field',
  standalone:false,
  templateUrl: './auth-form-field.component.html',
  styleUrls: []
})
export class AuthFormFieldComponent {
  @Input({required:true}) label: string = '';
  @Input({required:true}) id: string = '';
  @Input({required:true}) name: string = '';
  @Input({required:true}) type: string = 'text';
  @Input({required:true}) formControl: FormControl = new FormControl()


}
