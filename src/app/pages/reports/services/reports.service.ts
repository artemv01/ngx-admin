import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HTTP_ERROR_HANDLER } from '@app/shared/helpers/handle-error';
import { LoadingService } from '@app/shared/services/loading.service';
import { environment } from '@root/environments/environment';
import { Observable } from 'rxjs';
import { finalize, catchError, tap } from 'rxjs/operators';
import { Report } from '../models/report';
import { ReportType } from '../models/report-type';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    @Inject(HTTP_ERROR_HANDLER) readonly handleError
  ) {}

  getReport(type: ReportType): Observable<Report> {
    return this.http.get<Report>(environment.apiUrl + `reports/${type}`).pipe(
      catchError<Report, Observable<Report>>((err) => this.handleError(err))
    );
  }
}
