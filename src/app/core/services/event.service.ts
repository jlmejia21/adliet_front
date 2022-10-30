import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventResponse } from '@core/interfaces/event';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEvents() {
    return this.http.get<EventResponse>(`${environment.url}/event`);
  }

  getEventJob() {
    return this.http.get<any>(`${environment.url}/event/job`);
  }
}
