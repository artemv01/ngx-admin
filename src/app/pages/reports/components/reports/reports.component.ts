import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, ThemeService as ChartTheme } from 'ng2-charts';
import { Report } from '../../models/report';
import { format } from 'date-fns';
import { ReportType } from '../../models/report-type';
import { Observable, Subject } from 'rxjs';
import { ReportsService } from '../../services/reports.service';
import { shareReplay, takeUntil, tap } from 'rxjs/operators';
import { report } from 'process';
import { LoadingService } from '@app/shared/services/loading.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ThemeService } from '@app/shared/services/theme.service';

function getCSSVar(v: string) {
  let style = getComputedStyle(document.body);
  console.log(style.getPropertyValue(`--${v}`));
  return style.getPropertyValue(`--${v}`);
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  /*  public chartColors: Color[] = [
    {

    },
  ]; */
  public chartOpts: ChartConfiguration = {
    data: {
      labels: [],
      datasets: [
        {
          fill: false,
          pointBackgroundColor: getCSSVar('c-chart-point'),
          pointBorderColor: getCSSVar('c-chart-point'),
          data: [],
          borderJoinStyle: 'round',
          borderColor: getCSSVar('c-chart-line'),
          backgroundColor: getCSSVar('c-chart-line'),
        },
      ],
    },
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: getCSSVar('c-chart-tooltip-bg'),
        titleFontColor: getCSSVar('c-chart-tooltip-title'),
        bodyFontColor: getCSSVar('c-chart-tooltip-body'),
      },
      scales: {
        yAxes: [
          {
            display: true,
            gridLines: {
              color: getCSSVar('c-chart-grid'),
              zeroLineColor: getCSSVar('c-chart-z-line'),
            },
            ticks: {
              fontColor: getCSSVar('c-chart-ticks'),
              callback: function (value, index, values) {
                let formatter = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                });

                return formatter.format(Number(value));
              },
            },
          },
        ],
        xAxes: [
          {
            display: true,
            gridLines: {
              color: getCSSVar('c-chart-grid'),
              zeroLineColor: getCSSVar('c-chart-z-line'),
            },
            ticks: {
              fontColor: getCSSVar('c-chart-ticks'),
            },
          },
        ],
      },
    },
  };

  public lastYear$: Observable<Report>;
  public lastMonth$: Observable<Report>;
  public lastWeek$: Observable<Report>;

  private destroy$: Subject<null> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private reportSerive: ReportsService,
    public loadingService: LoadingService,
    private chartTheme: ChartTheme,
    private themeService: ThemeService
  ) {
    this.lastYear$ = reportSerive.getReport('last-year').pipe(shareReplay(1));
    this.lastMonth$ = reportSerive.getReport('last-month').pipe(shareReplay(1));
    this.lastWeek$ = reportSerive.getReport('last-week').pipe(shareReplay(1));
  }

  ngOnInit(): void {
    this.loadingService.show();

    this.setData('last-year');
  }

  ngAfterViewInit() {
    this.themeService.isDarkTheme$
      .pipe(
        takeUntil(this.destroy$),
        tap((isDarkTheme) => {
          /*  this.chartOpts.data.datasets[0].backgroundColor = getCSSVar(
            'c-chart-line'
          );
          this.chartOpts.data.datasets[0].borderColor = getCSSVar(
            'c-chart-point'
          ); */
          const dataset = this.chartOpts.data.datasets.pop();
          dataset.backgroundColor = getCSSVar('c-chart-line');
          dataset.borderColor = getCSSVar('c-chart-line');
          dataset.pointBackgroundColor = getCSSVar('c-chart-point');
          dataset.pointBorderColor = getCSSVar('c-chart-point');
          console.log(dataset.backgroundColor);

          this.chartOpts.data.datasets.push(dataset);
          let overrides: ChartOptions;
          overrides = {
            tooltips: {
              backgroundColor: getCSSVar('c-chart-tooltip-bg'),
              titleFontColor: getCSSVar('c-chart-tooltip-title'),
              bodyFontColor: getCSSVar('c-chart-tooltip-body'),
            },
            scales: {
              yAxes: [
                {
                  gridLines: {
                    color: getCSSVar('c-chart-grid'),
                    zeroLineColor: getCSSVar('c-chart-z-line'),
                  },
                  ticks: {
                    fontColor: getCSSVar('c-chart-ticks'),
                  },
                },
              ],
              xAxes: [
                {
                  gridLines: {
                    color: getCSSVar('c-chart-grid'),
                    zeroLineColor: getCSSVar('c-chart-z-line'),
                  },
                  ticks: {
                    fontColor: getCSSVar('c-chart-ticks'),
                  },
                },
              ],
            },
          };
          this.chartTheme.setColorschemesOptions(overrides);
        })
      )
      .subscribe();
  }

  setData(reportType: ReportType) {
    switch (reportType) {
      case 'last-year': {
        this.lastYear$.subscribe((data) => {
          this.chartOpts.data.datasets[0].data = Object.values(data);
          // this.chartOpts.data.datasets[0].data = Object.values(data);
          this.chartOpts.data.labels = Object.keys(data).map((time) => {
            return format(new Date(Number(time)), 'MMMM');
          });
          this.loadingService.hide();
        });
        break;
      }
      case 'last-month': {
        this.lastMonth$.subscribe((data) => {
          this.chartOpts.data.datasets[0].data = Object.values(data);
          this.chartOpts.data.labels = Object.keys(data).map((time) => {
            return format(new Date(Number(time)), 'MMM d');
          });
          this.loadingService.hide();
        });
        break;
      }
      case 'last-week': {
        this.lastWeek$.subscribe((data) => {
          this.chartOpts.data.datasets[0].data = Object.values(data);
          this.chartOpts.data.labels = Object.keys(data).map((time) => {
            return format(new Date(Number(time)), 'MMM d');
          });
          this.loadingService.hide();
        });
        break;
      }
    }
  }

  onChartTypeChange(event: MatButtonToggleChange) {
    this.setData(event.value);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
