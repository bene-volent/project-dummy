import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
  standalone:false,
})
export class AuthFormComponent {
 @Input({required:true}) heroHeading!:string

 ngOnInit(){
  // console.log(this.heroHeading)
 }
}
