import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@root/environments/environment';
import { LoginResp } from '../../models/login-resp';
import { UserAuth } from '../../models/user-auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  environment = environment;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  private fillEmail: string = 'example@example.com';
  private fillPassword: string = 'password12' ;

  loading = false;
  loginForm = this.fb.group({
    email: [this.fillEmail, [Validators.required, Validators.email]],
    password: [
      this.fillPassword,
      [Validators.required, Validators.minLength(8)],
    ],
  });
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  public login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.auth.signin(this.loginForm.value).subscribe(
      (userData: LoginResp) => {
        const expiresIn = Number(userData.expires_in);
        const expirationDate = new Date(new Date().getTime() + expiresIn);

        const user = new UserAuth(userData.access_token, expirationDate);
        this.auth.user.next(user);
        this.auth.autoLogout(userData.expires_in);
        localStorage.setItem('userData', JSON.stringify(user));

        this.router.navigate(['/dashboard/products']);
      },
      (err) => {
        this.loginForm.reset();
        this.loading = false;
      }
    );
  }
  ngOnInit(): void {}
}
