import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toObservable} from '@angular/core/rxjs-interop'
import { Router } from '@angular/router';
import { take, tap } from 'rxjs';
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}



@Injectable({
  providedIn: 'root'
})
export class UsersService {

  backendUrl = 'http://localhost:3000';

  private user = signal<User|null>(null);
  user$ = toObservable(this.user)
  
  user$$ = this.user.asReadonly()
  
  
  httpClient = inject(HttpClient)
  router = inject(Router)

  constructor() { 
    this.loginViaToken().subscribe({
      next: () => { 
        this.router.navigate(['/dashboard'])
      },
      error: () => {
        this.router.navigate(['/login'])
      }
    })
  }

   signup(request: SignupRequest) {
    return this.httpClient.post<{message:string,user:User}>(`${this.backendUrl}/signup`, request,{
      withCredentials: true
    }).pipe(
      take(1),
      tap({
        next: (response) => {
          this.user.set(response.user)
        }
      })
    );
  }

  loginViaToken() {
    return this.httpClient.post<{message:string,user:User}>(`${this.backendUrl}/login-token`, {},{
      withCredentials: true
    }).pipe(
      take(1),

      tap({
        next: (response) => {
          this.user.set(response.user)
        }
      })
    )
  }

   login(request: LoginRequest) {
    return this.httpClient.post<{message:string,user:User}>(`${this.backendUrl}/login`, request,{
      withCredentials: true
    }).pipe(
      take(1),
      tap({
        next: (response) => {
          this.user.set(response.user)
        }
      })
    );
  }

  forgotPassword(username: string) {
    return this.httpClient.post<{message:string}>(`${this.backendUrl}/forgot-password`, {username}).pipe(
      take(1),

      tap({
        next: (response) => {
          alert(response.message)
        }
      })
    );
  }

  logout() {
    // Step 1: Clear the user state
    
    // Step 2: Optionally, make a backend call to log out (if you have a logout endpoint)
    this.httpClient.post(`${this.backendUrl}/logout`, {}, { withCredentials: true }).pipe(
      take(1) // Automatically unsubscribe after the first emission
    ).subscribe({
      next: () => {
        this.user.set(null);  // Clear the stored user data
        // Step 3: Redirect to login page
        this.router.navigate(['/login']);
      },
      error: () => {
        // Handle logout error (optional)
        console.error("Logout failed");
        this.router.navigate(['/login']);  // Redirect even if logout fails
      }
    });
  }
  

}
