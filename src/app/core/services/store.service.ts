import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@core/interfaces/store';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<Store[]>(`${environment.url}/store/`)
      .pipe(map((response: any) => response.stores));
  }

  getById(id: number) {
    return this.http.get<Store>(`${environment.url}/store/${id}`);
  }

  add(store: Partial<Store>) {
    return this.http.post(`${environment.url}/store/`, store);
  }

  edit(id: number, store: Partial<Store>) {
    return this.http.put(`${environment.url}/store/${id}`, store);
  }

  getActivities(store: any, start_date: string, end_date: any) {
    let params = new HttpParams()
      .set('store', store)
      .set('start_date', start_date)
      .set('end_date', end_date);

    return this.http.get(`${environment.url}/store/search`, { params: params });
  }
}
