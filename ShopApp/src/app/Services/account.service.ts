import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleModel } from '../model/RoleModel';
import { SignUpDTO } from '../model/SignUpDTO';
import { SignInModel } from '../model/SignInModel';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  /* Constructor */
  constructor(private httpClient: HttpClient) { }

  /* Insert new role */
  InsertRole(role: RoleModel): Observable<any> {
    return this.httpClient.post('https://localhost:44333/api/account/AddRole', role);
  }

  /* Get all roles */
  getRoles(): Observable<any> {
    return this.httpClient.get('https://localhost:44333/api/Account/loadAllRoles');
  }

  /* Create new account */
  createAccount(signUpDTO: SignUpDTO): Observable<any> {
    return this.httpClient.post('https://localhost:44333/api/account/CreateAccount', signUpDTO);
  }

  /* Login */
  login(signInModel: SignInModel): Observable<any> {
    return this.httpClient.post('https://localhost:44333/api/account/login', signInModel);
  }
}
