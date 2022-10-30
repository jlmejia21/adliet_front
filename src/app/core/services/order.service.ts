import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getAllOrdersByStore(id: number) {
    return this.http.get<any>(`${environment.url}/order/store/all/${id}`);
  }
  getOrdersPendingByStore(id: number) {
    return this.http.get<any>(`${environment.url}/order/store/${id}`);
  }

  getOrdersByFilter(store: any, start_date: string, end_date: any) {
    let params = new HttpParams()
      .set('id_store', store)
      .set('start_date', start_date)
      .set('end_date', end_date);

    return this.http.get(`${environment.url}/order/search`, { params: params });
  }

  getOrdersByCodes(codes: string[]) {
    return this.http.post(`${environment.url}/order/find`, { codes });
  }

  updateStatusToCompleted(id: number) {
    return this.http.put(`${environment.url}/order/${id}`, null);
  }

  getCountsOrdersGroupByStore() {
    return this.http.get<any>(`${environment.url}/order/reportCountStore`);
  }

  getOrdersByGroupSent() {
    return this.http.get<any>(`${environment.url}/order/reportGroupSent`);
  }

  getOrdersByStoreGroupByDate() {
    return this.http.get<any>(
      `${environment.url}/order/ordersByStoreGroupByDate`
    );
  }
}
