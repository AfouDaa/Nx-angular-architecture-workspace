import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-log-table',
  template: ` <div style="background:#fff">
    <nz-page-header nzBackIcon>
      <nz-page-header-title> Parents Management System</nz-page-header-title>
      <nz-page-header-extra>
        <nz-space>
        </nz-space>
      </nz-page-header-extra>
      <nz-page-header-content>
        <div class="content">
          <div class="main">
            <nz-descriptions nzSize="small" [nzColumn]="2">
              <nz-descriptions-item nzTitle="Created" [nzSpan]="1">Lili Qu</nz-descriptions-item>
              <nz-descriptions-item nzTitle="Association" [nzSpan]="1"><a>421421</a></nz-descriptions-item>
              <nz-descriptions-item nzTitle="Creation Time" [nzSpan]="1">2017-01-10</nz-descriptions-item>
              <nz-descriptions-item nzTitle="Effective Time" [nzSpan]="1">2017-10-10</nz-descriptions-item>
            </nz-descriptions>
          </div>
          <div class="extra">
            <div>
              <nz-statistic nzTitle="Status" nzValue="Active"></nz-statistic>
              <nz-statistic nzTitle="Total" [nzValue]="110"  style="margin: 0 32px"></nz-statistic>
            </div>
          </div>
        </div>
      </nz-page-header-content>

    </nz-page-header>
    </div>

    <router-outlet></router-outlet>`,
  standalone: true,
  imports: [
    RouterOutlet,
    NzButtonModule,
    NzDescriptionsModule,
    NzGridModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzStatisticModule,
    NzTagModule,
],
    styles: [
    `
      .content {
        display: flex;
      }

      .extra > div {
        display: flex;
        width: max-content;
        justify-content: flex-end;
      }

      @media (max-width: 576px) {
        .content {
          display: block;
        }

        .main {
          width: 100%;
          margin-bottom: 12px;
        }

        .extra {
          width: 100%;
          margin-left: 0;
          text-align: left;
        }
      }
    `
  ]

})
export class PageComponent {}
