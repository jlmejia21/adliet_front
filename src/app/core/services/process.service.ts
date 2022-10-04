import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(private http: HttpClient) {}

  processFile(formData: FormData) {
    let headers = new HttpHeaders();
    headers
      .set('Content-Type', 'multipart/form-data')
      .set('Accept', 'application/json');
    return this.http.post(`${environment.urlKmeans}`, formData, { headers });
  }

  add(payload: any) {
    return this.http.post(`${environment.url}/process/`, payload);
  }

  sendEmail(id: number) {
    return this.http.post(`${environment.url}/process/sendEmail`, { id: id });
  }
}
