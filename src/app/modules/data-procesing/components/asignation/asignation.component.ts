import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { AsignationService } from '@core/services/asignation.service';
import { from, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-asignation',
  templateUrl: './asignation.component.html',
  styleUrls: ['./asignation.component.scss'],
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsignationComponent implements OnInit, OnDestroy {
  @ViewChild('mapRef', { static: true }) mapElement!: ElementRef;
  map: any;
  markers: google.maps.Marker[] = [];
  places = [
    {
      name: 'Falabella - Megaplaza Norte',
      lat: -11.993703082845489,
      lng: -77.06014625534024,
      codigo: 'TIENDA0001',
      pedidos: 5,
    },
    {
      name: 'Falabella - Plaza Norte',
      lat: -12.005954409465154,
      lng: -77.05719551445385,
      codigo: 'TIENDA0002',
      pedidos: 6,
    },
    {
      name: 'Falabella - Comas',
      lat: -11.936114473763464,
      lng: -77.06476373190357,
      codigo: 'TIENDA0003',
      pedidos: 15,
    },
    {
      name: 'Falabella - San Miguel',
      lat: -12.07652445507582,
      lng: -77.08364567845197,
      codigo: 'TIENDA0004',
      pedidos: 90,
    },
  ];
  infoWindows: any[] = [];
  results: any[] = [];
  private unsubscribe$: Subject<void> = new Subject();

  constructor(private _asignationService: AsignationService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this._asignationService
      .getOrderAsignation()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.results = res;
        this.renderMap();
      });
    // this.renderMap();
  }

  async loadMap() {
    this.results.forEach((row) => {
      const marker = this.createMarker(row);
      this.markers.push(marker);
      const contentMarker = this.contentMarker(row);
      const infowindow = new window['google'].maps.InfoWindow({
        content: contentMarker,
      });
      this.infoWindows = [...this.infoWindows, infowindow];
      marker.addListener('click', () => {
        infowindow.open(this.map, marker);
      });
    });
  }
  renderMap() {
    window['initMap'] = () => {
      this.getLocationPromise().then((position: any) => {
        this.map = new window['google'].maps.Map(
          this.mapElement.nativeElement,
          {
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            zoom: 11,
          }
        );
        this.loadMap();
      });
    };
    if (!window.document.getElementById('google-map-script')) {
      const s = window.document.createElement('script');
      s.id = 'google-map-script';
      s.type = 'text/javascript';
      s.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleApiKey}&callback=initMap`;

      window.document.body.appendChild(s);
    } else {
      this.getLocationPromise().then((position: any) => {
        this.map = new window['google'].maps.Map(
          this.mapElement.nativeElement,
          {
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            zoom: 11,
          }
        );
        this.loadMap();
      });
    }
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

  async addMark() {
    const newPlace = {
      name: 'Falabella - Nuevo',
      lat: -12.01232445507582,
      lng: -77.08364567845197,
      codigo: 'TIENDA0009',
      pedidos: 40,
    };
    const isFound = this.places.some(
      (place) => newPlace.codigo === place.codigo
    );
    if (isFound) return;

    this.places = [...this.places, newPlace];

    const marker = this.createMarker(newPlace);
    this.markers.push(marker);
    const contentMarker = this.contentMarker(newPlace);

    const infowindow = new window['google'].maps.InfoWindow({
      content: contentMarker,
    });

    marker.addListener('click', () => {
      infowindow.open(this.map, marker);
    });
  }

  createMarker(row: any) {
    return new window['google'].maps.Marker({
      position: {
        lat: Number(row.store.latitude),
        lng: Number(row.store.longitude),
      },
      label: {
        text: `${row.store.name}: [${row.orders.length}]`,
        fontSize: '16px',
        fontWeight: 'bold',
      },
      icon: '../../../../../assets/images/falabella.png',
      map: this.map,
      title: row.store.name,
      draggable: false,
      animation: window['google'].maps.Animation.DROP,
    });
  }

  contentMarker(row: any) {
    const contentString = '<div id="content">'
      .concat('<div id="siteNotice">')
      .concat('</div>')
      .concat(
        `<h3 id="thirdHeading" class="thirdHeading">${row.store.name}</h3>`
      )
      .concat('<div id="bodyContent">')
      .concat(`<p>Numero de pedidos: <strong>${row.orders.length}</strong></p>`)
      .concat('</div>')
      .concat('</div>');
    return contentString;
  }

  onRegister() {
    console.log(this.results);
  }
}
