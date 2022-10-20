import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { DistanceService } from '@core/services/distance.service';
import { StoreService } from '@core/services/store.service';
import { Loader } from '@googlemaps/js-api-loader';
import { from, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-info-order',
  templateUrl: './info-order.component.html',
  styleUrls: ['./info-order.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class InfoOrderComponent implements OnInit, OnDestroy {
  @ViewChild('mapRef', { static: true }) mapElement!: ElementRef;
  map: any;

  store: any = null;
  destination: any = null;
  origin: any = null;
  distance: any = null;
  duration: any = null;
  order: any = null;
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
      .subscribe((order) => {
        this.order = order;
        this.getDistance(order);
      });
  }

  getDistance(order: any) {
    this.loader.load().then((google) => {
      const origins = new google.maps.LatLng(
        this.store.latitude,
        this.store.longitude
      );
      const destinations = new google.maps.LatLng(
        order.latitude,
        order.longitude
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
          this.renderMap();
          // this.destination = results.destinationAddresses[0];
        }
      );
    });
  }

  renderMap() {
    console.log(this.store);
    window['initMap'] = () => {
      // this.getLocationPromise().then((position: any) => {
      this.map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        center: {
          lat: Number(this.store.latitude),
          lng: Number(this.store.longitude),
        },
        zoom: 14,
      });
      this.loadMap();
      // });
    };
    if (!window.document.getElementById('google-map-script')) {
      const s = window.document.createElement('script');
      s.id = 'google-map-script';
      s.type = 'text/javascript';
      s.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleApiKey}&callback=initMap`;

      window.document.body.appendChild(s);
    } else {
      // this.getLocationPromise().then((position: any) => {
      this.map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        center: {
          lat: Number(this.store.latitude),
          lng: Number(this.store.longitude),
        },
        zoom: 14,
      });
      this.loadMap();
      // });
    }
  }

  async loadMap() {
    // Tienda
    const marker = this.createMarker({
      latitude: this.store.latitude,
      longitude: this.store.longitude,
      name: this.store.name,
      isStore: true,
    });
    const contentMarker = this.contentMarker({ name: this.store.name });
    const infowindow = new window['google'].maps.InfoWindow({
      content: contentMarker,
    });
    marker.addListener('click', () => {
      infowindow.open(this.map, marker);
    });

    // Destino
    const markerDestino = this.createMarker({
      latitude: this.order.latitude,
      longitude: this.order.longitude,
      name: 'Pedido #' + this.order.code,
      isStore: false,
    });
    const contentMarkerDestino = this.contentMarker({
      name: 'Pedido #' + this.order.code,
    });
    const infowindowDestino = new window['google'].maps.InfoWindow({
      content: contentMarkerDestino,
    });

    markerDestino.addListener('click', () => {
      infowindowDestino.open(this.map, markerDestino);
    });
  }

  createMarker({ latitude, longitude, name, isStore }: any) {
    return new window['google'].maps.Marker({
      position: {
        lat: Number(latitude),
        lng: Number(longitude),
      },
      icon: isStore
        ? '../../../../../assets/images/falabella.png'
        : '../../../../../assets/images/home-3.png',
      map: this.map,
      title: name,
      draggable: false,
      animation: window['google'].maps.Animation.DROP,
    });
  }

  contentMarker({ name }: any) {
    const contentString = '<div id="content">'
      .concat('<div id="siteNotice">')
      .concat('</div>')
      .concat(`<h3 id="thirdHeading" class="thirdHeading">${name}</h3>`)
      .concat('</div>');
    return contentString;
  }

  getLocationPromise() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
  }
  getLocationObservable() {
    return from(this.getLocationPromise());
  }

  onBack() {
    this.location.back();
  }
}
