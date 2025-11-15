import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleModel } from 'src/app/model/RoleModel';
import { SignUpDTO } from 'src/app/model/SignUpDTO';
import { AccountService } from 'src/app/Services/account.service';
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  /* Role list */
  roleList!: RoleModel[];

  /* Form group */
  createForm!: FormGroup;

  /* Password visibility toggle */
  showUserPassword = false;

  /* Constructor */
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ){}

  /* Initialize component */
  ngOnInit(): void {
    this.BuildForm();
  }

  /* Build form */
  BuildForm() {
    this.createForm = this.formBuilder.group({
      txtname: ['', Validators.required],
      txtEmail: ['', Validators.compose([Validators.required, Validators.email])],
      txtDOB: ['', Validators.required],
      txtPassword: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
    });
  }

  /* Create account */
  createAccount() {
    debugger
    if(this.createForm.valid){
      var SignUp = new SignUpDTO();
      SignUp.name = this.createForm.value['txtname'];
      SignUp.email = this.createForm.value['txtEmail'];
      SignUp.dob = this.createForm.value['txtDOB'];
      SignUp.password = this.createForm.value['txtPassword'];

      /* Call API */
      this.accountService.createAccount(SignUp).subscribe({
        next: () => {
          Swal.fire({
            title: "Saved successfully",
            icon: "success",
            draggable: true
          });
        },
        error: err => console.error('❌ Error:', err)
      });
    }
  }

  /* Toggle password visibility */
  toggleUserPassword() {
    this.showUserPassword = !this.showUserPassword;
  }

  /* Navigate to login */
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
