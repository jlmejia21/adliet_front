import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { OrderService } from '@core/services/order.service';
import { ChartData, ChartOptions } from 'chart.js';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: '' }],
  };
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [], label: '' }],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Pedidos procesados por Tienda',
      },
    },
  };
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Pedidos enviados y por enviar por Tienda',
      },
    },
  };

  stores!: any[];
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private orderService: OrderService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.orderService.getCountsOrdersGroupByStore(),
      this.orderService.getOrdersByGroupSent(),
      this.orderService.getOrdersByStoreGroupByDate(),
    ]).subscribe((resp: any) => {
      this.mapPieChar(resp[0].data);
      this.mapBarChar(resp[1].data);
      this.stores = resp[2].data;
      this.cd.detectChanges();
    });
  }

  mapPieChar(data: any) {
    this.pieChartData = {
      datasets: [
        {
          data: data.map((r: any) => r.orders),
          label: 'Tiendas',
        },
      ],
      labels: data.map((r: any) => r.store_name),
    };
  }

  mapBarChar(data: any) {
    this.barChartData = {
      datasets: [
        {
          data: data.map((r: any) => r.sent),
          label: 'Enviados',
        },
        {
          data: data.map((r: any) => r.not_sent),
          label: 'Sin enviar',
        },
      ],
      labels: data.map((r: any) => r.store_name),
    };
  }
}
