import { Component, DestroyRef, inject, } from '@angular/core';
import { AuthFormModule } from '../../shared/components/auth/auth.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatchPasswordValidator, PasswordValidator } from '../../shared/components/auth/utils';
import { first } from 'rxjs';
import { SignupRequest, UsersService } from '../../shared/services/users.service';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [AuthFormModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {

  usersService = inject(UsersService)
  destroyRef = inject(DestroyRef)
  router = inject(Router);


  form = new FormGroup({
    name: new FormGroup({
      first: new FormControl('', {
        validators: [Validators.required]
      }),
      last: new FormControl('', {
        validators: []
      })
    }),
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, PasswordValidator]
      }),
      passwordConfirmation: new FormControl('', {
        validators: [Validators.required]
      })
    }, {
      validators: [MatchPasswordValidator]
    })
  });


  onSubmit() {
    if (this.form.invalid) {
      // console.log(this.form.errors)
      return
    }


    // console.log(this.form.value)

    const data: SignupRequest = {
      firstName: this.form.value.name!.first!,
      lastName: this.form.value.name!.last!,
      username: this.form.value.username!,
      email: this.form.value.email!,
      password: this.form.value.passwords!.password!
    }

    const subscription = this.usersService.signup(data).subscribe({
      next: (response) => {
        console.log(response)
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        alert(error.error.error)
        
      }
    })

    

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    } 
    )
  }
  getPasswordErrors(){
    return this.form.controls.passwords.controls.password.errors ?? {}
  }
}
