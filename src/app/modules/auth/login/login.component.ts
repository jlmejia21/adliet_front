import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROLES } from '@core/enums/roles';
import { User } from '@core/interfaces/user';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  formLogin: FormGroup;

  options = {
    autoClose: true,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.formLogin = this.fb.group({
      username: ['jose@gmail.com', Validators.required],
      password: ['12345678', Validators.required],
      // username: [null, Validators.required],
      // password: [null, Validators.required],
    });
  }

  get username() {
    return this.formLogin.get('username');
  }

  get password() {
    return this.formLogin.get('password');
  }

  onSubmit() {
    if (this.formLogin.invalid) return;
    this.alertService.clear();
    const credentials: User = {
      email: this.username?.value,
      password: this.password?.value,
    };

    this.authService
      .signin(credentials)
      .pipe(
        tap((res: boolean) => {
          if (!res) return;

          if (this.authService.getRole() === ROLES.ADMIN) {
            this.router.navigate(['/dashboard']);
            return;
          }

          this.router.navigate(['/orders']);
        }),
        catchError(async (error) => {
          this.alertService.error(error.error.message, this.options);
        })
      )
      .subscribe();
  }
}
