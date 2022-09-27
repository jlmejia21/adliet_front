import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsignationService {
  private _orderAsignation = new BehaviorSubject([]);
  private _orderAsignation$ = this._orderAsignation.asObservable();

  getOrderAsignation() {
    return this._orderAsignation$;
  }

  setOrderAsignation(orders: any) {
    return this._orderAsignation.next(orders);
  }
}
