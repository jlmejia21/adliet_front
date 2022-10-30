import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '@core/interfaces/user';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';

describe('Login Component', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let comp: LoginComponent;

  let mockAuthService: jasmine.SpyObj<AuthService>;
  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['signin']);

    mockAuthService.signin.and.returnValue(of());

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });

    fixture = TestBed.createComponent(LoginComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login component using TestBed', () => {
    expect(comp).toBeDefined();
  });

  it(`should have as title ADLIET`, () => {
    expect(comp.title).toEqual('ADLIET');
  });

  it('test a form group element count', () => {
    const formElement: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector('#loginForm');
    const inputElements = formElement.querySelectorAll('input');
    expect(inputElements.length).toEqual(2);
  });

  it('Check initial form values for login Form Group', () => {
    const loginFormGroup = comp.formLogin;
    const loginFormValues = {
      username: null,
      password: null,
    };
    expect(loginFormGroup.value).toEqual(loginFormValues);
  });

  it('should allow user to log in', () => {
    const credentials = {
      username: 'something@somewhere.com',
      password: '8938ndisn@din',
    };

    const user: User = {
      email: credentials.username,
      password: credentials.password,
    };

    comp.formLogin.setValue(credentials);
    comp.onSubmit();

    expect(mockAuthService.signin).toHaveBeenCalledWith(user);
  });

  it('should not allow user to log in', () => {
    const credentials = {
      username: null,
      password: '8938ndisn@din',
    };

    comp.formLogin.setValue(credentials);
    comp.onSubmit();

    expect(comp.formLogin.invalid).toEqual(true);
    expect(mockAuthService.signin).toHaveBeenCalledTimes(0);
  });
});
