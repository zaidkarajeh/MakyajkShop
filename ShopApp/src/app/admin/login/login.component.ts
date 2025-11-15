import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignInModel } from 'src/app/model/SignInModel';
import { AccountService } from 'src/app/Services/account.service';
import { CartService } from 'src/app/Services/cart.service'; // Cart service
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /* Error message */
  loginError: string | null = null;

  /* Password toggle */
  showUserPassword = false;

  /* Form group */
  loginForm!: FormGroup;

  /* Shake animation */
  shake = false;

  /* Constructor */
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private cartService: CartService // Cart service injection
  ) {}

  /* Initialize component */
  ngOnInit(): void {
    this.BuildForm();
  }

  /* Build login form */
  BuildForm() {
    this.loginForm = this.formBuilder.group({
      txtusername: ['', Validators.required],
      txtPassword: ['', Validators.required],
    });
  }

  /* Login action */
  login() {
    if (this.loginForm.valid) {
      const signInModel = new SignInModel();
      signInModel.Username = this.loginForm.value['txtusername'];
      signInModel.Password = this.loginForm.value['txtPassword'];

      /* Call API */
      this.accountService.login(signInModel).subscribe({
        next: data => {
          /* Save user data */
          localStorage.setItem("APIToken", data.token);
          localStorage.setItem("userEmail", signInModel.Username);

          /* Load user cart */
          this.cartService.switchUser(signInModel.Username);

          this.loginError = null;
          this.router.navigate(['']); // Navigate to dashboard/home
        },
        error: () => {
          this.showErrorAnimation('Invalid email or password');
        }
      });
    } else {
      this.showErrorAnimation('Please fill all fields');
    }
  }

  /* Show error with shake animation */
  showErrorAnimation(message: string) {
    this.loginError = message;
    this.shake = true;

    setTimeout(() => this.shake = false, 500);
    setTimeout(() => { this.loginError = null; }, 3000);
  }

  /* Navigate to create account */
  goToCreateAccount() {
    this.router.navigate(['/CreateAccount']);
  }

  /* Toggle password visibility */
  toggleUserPassword() {
    this.showUserPassword = !this.showUserPassword;
  }
}
