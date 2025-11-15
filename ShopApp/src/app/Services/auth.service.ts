import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* Admin email */
  private adminEmail = 'zaid@gmail.com';

  /* Login user */
  login(email: string) {
    localStorage.setItem('userEmail', email);
  }

  /* Logout user */
  logout() {
    localStorage.removeItem('userEmail');
  }

  /* Check if logged in */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userEmail');
  }

  /* Check if admin */
  isAdmin(): boolean {
    const email = localStorage.getItem('userEmail');
    return email === this.adminEmail;
  }
}
