import { Component, DestroyRef, ElementRef, viewChild,inject, signal } from '@angular/core';
import { AuthFormModule } from '../../shared/components/auth/auth.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordValidator } from '../../shared/components/auth/utils';
import { LoginRequest, UsersService } from '../../shared/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [AuthFormModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent { 

  usersService = inject(UsersService)
  destroyRef = inject(DestroyRef)
  modalRef = viewChild<ElementRef<HTMLDialogElement>>('forgotPasswordModal')
  router = inject(Router);
  error = signal('')

  form = new FormGroup({
    username: new FormControl('',{
      validators:[Validators.required,Validators.minLength(3)]
    }),
    password: new FormControl('',{
      validators: [Validators.required,PasswordValidator]
    })
  });

  
  

  onSubmit(){
    if (this.form.invalid){
      // console.log(this.form.errors)
      return
    }

    // console.log(this.form.value)

    const data: LoginRequest = {
      
      username: this.form.value.username!,
      password: this.form.value.password!
    }

    const subscription = this.usersService.login(data).subscribe({
      next: (response) => {
        // console.log(response)
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        alert(error.error.error)
        this.error.set(error.error.error)
      }
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    } 
    )
  }
}
