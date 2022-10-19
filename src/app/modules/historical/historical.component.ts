import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PipeModule } from '@core/pipes/pipe.module';
import { AuthService } from '@core/services/auth.service';
import { DistanceService } from '@core/services/distance.service';
import { OrderService } from '@core/services/order.service';
import { StoreService } from '@core/services/store.service';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PipeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoricalComponent implements OnInit {
  tiendaControl: FormControl = new FormControl('');
  pedidos: any[] = [];
  store: any = null;
  loader = new Loader({
    apiKey: environment.googleApiKey,
  });

  constructor(
    private orderService: OrderService,
    public authService: AuthService,
    public distanceService: DistanceService,
    private cd: ChangeDetectorRef,
    public storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getStore();
    this.onSearch();
  }

  getStore() {
    const authStore = this.authService.getStore();
    this.storeService.getById(Number(authStore)).subscribe((res) => {
      this.store = res;
      this.tiendaControl.setValue(res.name);
      this.cd.markForCheck();
    });
  }
  onSearch() {
    const store = this.authService.getStore();
    this.orderService
      .getAllOrdersByStore(Number(store))
      .subscribe((pedidos: any) => {
        this.pedidos = pedidos.data;
        this.cd.markForCheck();
      });
  }

  onMoreInformation(pedido: any) {
    this.distanceService.setOrderDistance(pedido);
    this.router.navigate(['/info-order']);

    // this.loader.load().then((google) => {
    //   const origins = new google.maps.LatLng(
    //     this.store.latitude,
    //     this.store.longitude
    //   );
    //   const destinations = new google.maps.LatLng(
    //     pedido.latitude,
    //     pedido.longitude
    //   );
    //   new google.maps.DistanceMatrixService().getDistanceMatrix(
    //     {
    //       origins: [origins],
    //       destinations: [destinations],
    //       travelMode: google.maps.TravelMode.DRIVING,
    //       unitSystem: google.maps.UnitSystem.METRIC,
    //       avoidHighways: false,
    //       avoidTolls: false,
    //     },
    //     (results: any) => {
    //       console.log(results);
    //       console.log(
    //         'resultados distancia (mts) -- ',
    //         results.rows[0].elements[0].distance.value
    //       );
    //     }
    //   );
    // });
  }
}
