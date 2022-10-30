import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Category, Event } from '@core/interfaces/event';
import { PipeModule } from '@core/pipes/pipe.module';
import { EventService } from '@core/services/event.service';
import cronstrue from 'cronstrue/i18n';
import { NgxPaginationModule } from 'ngx-pagination';
import { tap } from 'rxjs';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PipeModule, NgxPaginationModule],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  currentPage = 1;
  itemsPerPage = 10;

  complete = Category.COMPLETADO;
  incomplete = Category.INCOMPLETO;

  cronDescription = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService
      .getEvents()
      .pipe(
        tap((eventResponse) => {
          this.events = eventResponse.data;
        })
      )
      .subscribe();

    this.eventService
      .getEventJob()
      .pipe(
        tap((response) => {
          this.cronDescription = cronstrue.toString(response.data, {
            verbose: true,
            locale: 'es',
          });
        })
      )
      .subscribe();
  }
}
