import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(): boolean {
    if (this.authService.getToken() === null) {
      this.router.navigate(['auth/login']);
      return false;
    }
    return true;
  }
}
