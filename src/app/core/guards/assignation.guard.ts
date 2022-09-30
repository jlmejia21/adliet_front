import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AssignationService } from '@core/services/assignation.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssignationGuard implements CanActivate {
  constructor(
    private assignationService: AssignationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.assignationService.getOrderAsignation().pipe(
      map((results: any[]) => {
        const isEmpty = results.length === 0;
        if (isEmpty) {
          this.router.navigate(['data-procesing']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
