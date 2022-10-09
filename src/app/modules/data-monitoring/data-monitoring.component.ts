import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@core/interfaces/store';
import { OrderService } from '@core/services/order.service';
import { StoreService } from '@core/services/store.service';
import { ValidatorsExtend } from '@core/utils/validators-extend';
import { Observable } from 'rxjs';
import { createAutoCorrectedDatePipe } from 'text-mask-addons';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-data-monitoring',
  templateUrl: './data-monitoring.component.html',
  styleUrls: ['./data-monitoring.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataMonitoringComponent implements OnInit, AfterViewInit {
  formSearch: FormGroup;

  stores$: Observable<Store[]> = this.storeService.getAll();
  tabs = ['Actividad', 'Reportes', 'Procesamientos'];
  @ViewChildren('sectionContent') sectionContents!: QueryList<ElementRef>;
  @ViewChildren('liContent') liContents!: QueryList<ElementRef>;

  orders: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private renderer: Renderer2,
    private storeService: StoreService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.formSearch = this.fb.group({
      store: [null, []],
      start_date: [null, [ValidatorsExtend.todayAsMinDate()]],
      end_date: [null, [ValidatorsExtend.todayAsMinDate()]],
    });
  }

  ngAfterViewInit(): void {
    // this.setActiveTab(0);
  }

  ngOnInit(): void {
    this.onSubmit();
  }

  get start_date() {
    return this.formSearch.get('start_date');
  }

  get end_date() {
    return this.formSearch.get('end_date');
  }

  // onTab(tab: string, i: number) {
  //   this.clearClass();
  //   this.setActiveTab(i);
  // }

  // clearClass() {
  //   this.liContents.forEach((element) => {
  //     this.renderer.setAttribute(element.nativeElement, 'class', '');
  //   });

  //   this.sectionContents.forEach((element) => {
  //     this.renderer.setAttribute(element.nativeElement, 'class', 'tab-content');
  //   });
  // }

  // setActiveTab(index: number) {
  //   this.renderer.setAttribute(
  //     this.sectionContents.get(index)?.nativeElement,
  //     'class',
  //     'is-active'
  //   );

  //   this.renderer.setAttribute(
  //     this.liContents.get(index)?.nativeElement,
  //     'class',
  //     'is-active'
  //   );
  // }

  public get dateMask(): any {
    return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  }

  public get autoCorrectedDatePipe(): any {
    return createAutoCorrectedDatePipe('dd/mm/yyyy');
  }

  onSubmit() {
    if (!this.formSearch.valid) return;
    this.currentPage = 1;
    this.orderService
      .getOrdersByFilter(
        this.formSearch.value.store,
        this.formatDateString(this.formSearch.value.start_date),
        this.formatDateString(this.formSearch.value.end_date)
      )
      .subscribe((res: any) => {
        this.orders = res.data;
        this.cd.markForCheck();
      });
  }

  onDownload() {
    if (this.orders.length === 0) return;
    let element = document.getElementById('searchTable');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, 'data_monitoring.xlsx');
  }

  formatDateString(date: string | null): any {
    if (date === null || date === '') return null;
    var resultDate = date.split(/\D/);
    return resultDate.reverse().join('-');
  }
}
