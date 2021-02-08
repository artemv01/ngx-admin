import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ReportsService } from '../services/reports.service';

@Injectable({
  providedIn: 'root',
})
export class LastYearReportResolver implements Resolve<boolean> {
  constructor(private reports: ReportsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.reports.getReport('last-year');
  }
}
