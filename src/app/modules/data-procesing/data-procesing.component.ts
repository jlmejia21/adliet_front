import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AsignationService } from '@core/services/asignation.service';
import { ProcessingService } from '@core/services/processing.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-data-procesing',
  templateUrl: './data-procesing.component.html',
  styleUrls: ['./data-procesing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataProcesingComponent implements OnInit {
  formData: FormData = new FormData();
  dataExcel: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  proceedOrders!: number;
  notProceedOrders!: number;

  @ViewChild('inputFile')
  inputFile!: ElementRef;

  constructor(
    private router: Router,
    private processingService: ProcessingService,
    private asignationService: AsignationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  public uploadFile(event: any) {
    this.defaultValues();
    const fileList: FileList = event.srcElement.files;
    if (fileList !== null && fileList !== undefined && fileList.length > 0) {
      let file: File = fileList[0];
      this.formData.append('file', file, file.name);
      let input = event.target;
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(input.files[0]);
      fileReader.onload = () => {
        const workBook = XLSX.read(fileReader.result, { type: 'binary' });
        const sheetNames = workBook.SheetNames;
        this.dataExcel = XLSX.utils.sheet_to_json(
          workBook.Sheets[sheetNames[0]]
        );
        this.checkOrders(this.dataExcel.map((r) => r.ID));
        this.cd.detectChanges();
      };

      fileReader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    }
  }

  defaultValues() {
    this.dataExcel = [];
    this.formData = new FormData();
    this.proceedOrders = 0;
    this.notProceedOrders = 0;
  }

  checkOrders(listIds: string[]) {
    // const ordersProcessed: any[] = ['144012195046', '144012639393'];
    const ordersProcessed: any[] = [];
    const orders =
      this.dataExcel.filter((r) => ordersProcessed.includes(r.ID.toString())) ||
      [];
    this.proceedOrders = orders.length;
    this.notProceedOrders = this.dataExcel.length - this.proceedOrders;
    this.dataExcel.map((row) => {
      row.PROCEED = ordersProcessed.includes(row.ID.toString());
      return row;
    });
    this.cd.detectChanges();
  }

  onProcesing() {
    this.processingService.processFile(this.formData).subscribe((res) => {
      this.asignationService.setOrderAsignation(res);
      this.router.navigate(['/data-procesing/asignation']);
    });
  }

  onClear() {
    this.inputFile.nativeElement.value = '';
    this.defaultValues();
  }
}
