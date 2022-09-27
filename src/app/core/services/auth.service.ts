import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@core/interfaces/user';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  accessToken!: string | null;

  private _isLoggedIn = false;

  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  signin(user: User) {
    return this.http.post(`${environment.url}/auth/login`, user).pipe(
      map((response: any) => {
        if (response.data.accessToken) {
          this.accessToken = response.data.accessToken;
          this._isLoggedIn = true;

          localStorage.setItem('accessToken', this.accessToken as string);
          localStorage.setItem('user', user.email);
          localStorage.setItem('store', response.data.user.id_store);
          localStorage.setItem('role', response.data.user.role);

          return true;
        } else {
          this.logout();
          return false;
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('store');
    localStorage.removeItem('role');
    this.accessToken = null;
    this._isLoggedIn = false;
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  getStore() {
    return localStorage.getItem('store');
  }

  getRole() {
    return localStorage.getItem('role');
  }
}
