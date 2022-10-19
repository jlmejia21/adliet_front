import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DistanceService {
  private _orderDistance = new BehaviorSubject(null);
  private _orderDistance$ = this._orderDistance.asObservable();

  getOrderDistance() {
    return this._orderDistance$;
  }

  setOrderDistance(order: any) {
    return this._orderDistance.next(order);
  }
}
