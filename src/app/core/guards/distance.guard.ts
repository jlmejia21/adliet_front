import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DistanceService } from '@core/services/distance.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DistanceGuard implements CanActivate {
  constructor(
    private distanceService: DistanceService,
    private router: Router,
    private location: Location
  ) {}

  canActivate(): Observable<boolean> {
    return this.distanceService.getOrderDistance().pipe(
      map((result: any) => {
        const isEmpty = result === null;
        if (isEmpty) {
          this.location.back();
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
