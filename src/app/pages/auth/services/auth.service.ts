import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { throwError, BehaviorSubject, of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserAuth } from '../models/user-auth';
import { environment as env } from 'src/environments/environment';
import { LoginResp } from '../models/login-resp';
import { LoginReq } from '../models/login-req';
import { AlertService } from 'src/app/shared/services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: BehaviorSubject<UserAuth>;
  private tokenExpirationTimer: ReturnType<typeof setTimeout>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private alert: AlertService
  ) {
    const storedAuth = JSON.parse(localStorage.getItem('userData'));
    let user: UserAuth = null;
    if (storedAuth) {
      user = new UserAuth(storedAuth._token, storedAuth._tokenExpirationDate);
    }
    this.user = new BehaviorSubject<UserAuth>(user);
  }

  signin(data: LoginReq): Observable<any> {
    return this.http
      .post<LoginResp>(env.apiUrl + 'auth/login', {
        email: data.email,
        password: data.password,
      })
      .pipe(
        catchError((err) =>
          this.handleError(err, {
            401: 'Email or password are incorrect.',
            422: 'Email or password are incorrect.',
          })
        )
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  handleError(err: HttpErrorResponse, errMsg?: Record<number, any>) {
    let errorMessage = 'An unknown error occurred!';
    if (!err.status) {
      this.alert.show(errorMessage);
      return throwError(errorMessage);
    }

    if (errMsg && err.status in errMsg) {
      this.alert.show(errMsg[err.status]);

      return throwError(errMsg[err.status]);
    }

    this.alert.show(errorMessage);
    return throwError(err);
  }
}
