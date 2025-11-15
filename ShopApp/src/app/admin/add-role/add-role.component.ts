import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleModel } from 'src/app/model/RoleModel';
import { AccountService } from 'src/app/Services/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {

  /* Form group */
  roleForm!: FormGroup

  /* Constructor with dependencies */
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) {}

  /* Initialize component */
  ngOnInit(): void {
    this.BuildForm();
  }

  /* Build the form */
  BuildForm() {
    this.roleForm = this.formBuilder.group({
      txtname: ['', Validators.required],
    });
  }

  /* Save role */
  Save() {
    if (this.roleForm.valid) {
      const newRoleModel = new RoleModel();
      newRoleModel.name = this.roleForm.value['txtname'];
      
      /* Call API to insert role */
      this.accountService.InsertRole(newRoleModel).subscribe({
        next: () => {
          /* Show success alert */
          Swal.fire({
            title: "Saved successfully",
            icon: "success",
            draggable: true
          });
        }
      })
    }
  }
}
