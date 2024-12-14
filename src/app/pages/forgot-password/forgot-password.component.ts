import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AuthFormModule } from '../../shared/components/auth/auth.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [AuthFormModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  usersService = inject(UsersService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);

  message = signal('')

  forgotPasswordForm = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)]
    })
  });

  onForgotSubmit() {
    if (this.forgotPasswordForm.invalid) {
      // console.log(this.forgotPasswordForm.errors)
      return
    }

    // console.log(this.forgotPasswordForm.value)


    const username = this.forgotPasswordForm.get('username')!.value!


    const subscription = this.usersService.forgotPassword(username).subscribe({
      next: (response) => {
        console.log(response)
        this.message.set(response.message)
        setTimeout(() => {
          this.router.navigate(['/login'])
        } , 2000)
      },
      error: (error) => {
        this.message.set(error.error.message)
      }
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    }
    )
  }

}
