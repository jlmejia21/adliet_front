import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  search(store: any) {
    let params = new HttpParams().set('store', store);
    return this.http
      .get(`${environment.url}/order/search`, { params: params })
      .pipe(map((res: any) => res.data));
  }

  update(id: number) {
    return this.http.put(`${environment.url}/order/completed/`, { id });
  }
}
