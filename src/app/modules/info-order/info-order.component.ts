import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { DistanceService } from '@core/services/distance.service';
import { StoreService } from '@core/services/store.service';
import { Loader } from '@googlemaps/js-api-loader';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-info-order',
  templateUrl: './info-order.component.html',
  styleUrls: ['./info-order.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoOrderComponent implements OnInit, OnDestroy {
  store: any = null;
  destination: any = null;
  origin: any = null;
  distance: any = null;
  duration: any = null;

  loader = new Loader({
    apiKey: environment.googleApiKey,
  });
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    public authService: AuthService,
    public distanceService: DistanceService,
    private cd: ChangeDetectorRef,
    public storeService: StoreService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getStore();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getStore() {
    const authStore = this.authService.getStore();
    this.storeService.getById(Number(authStore)).subscribe((res) => {
      this.store = res;
      this.cd.markForCheck();
      this.getOrder();
    });
  }

  getOrder() {
    this.distanceService
      .getOrderDistance()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((pedido) => {
        this.getDistance(pedido);
      });
  }

  getDistance(pedido: any) {
    this.loader.load().then((google) => {
      const origins = new google.maps.LatLng(
        this.store.latitude,
        this.store.longitude
      );
      const destinations = new google.maps.LatLng(
        pedido.latitude,
        pedido.longitude
      );
      new google.maps.DistanceMatrixService().getDistanceMatrix(
        {
          origins: [origins],
          destinations: [destinations],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        (results: any) => {
          // console.log(results);
          this.destination = results.destinationAddresses[0];
          this.origin = results.originAddresses[0];
          this.distance = results.rows[0].elements[0].distance;
          this.duration = results.rows[0].elements[0].duration;
          this.cd.markForCheck();
          // this.destination = results.destinationAddresses[0];
        }
      );
    });
  }

  onBack() {
    this.location.back();
  }
}
