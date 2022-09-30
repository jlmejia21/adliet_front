import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssignationService {
  private _orderAssignation = new BehaviorSubject([]);
  private _orderAssignation$ = this._orderAssignation.asObservable();

  getOrderAsignation() {
    return this._orderAssignation$;
  }

  setOrderAsignation(orders: any) {
    return this._orderAssignation.next(orders);
  }
}
