import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { AssignationService } from '@core/services/assignation.service';
import { OrderService } from '@core/services/order.service';
import { ProcessService } from '@core/services/process.service';
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
  notProceedOrders: number = 0;

  options = {
    autoClose: true,
  };

  @ViewChild('inputFile')
  inputFile!: ElementRef;

  constructor(
    private router: Router,
    private processService: ProcessService,
    private assignationService: AssignationService,
    private orderService: OrderService,
    public alertService: AlertService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  public uploadFile(event: any) {
    this.defaultValues();
    const fileList: FileList = event.srcElement.files;
    if (fileList !== null && fileList !== undefined && fileList.length > 0) {
      let file: File = fileList[0];
      if (
        file.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        this.alertService.warn(
          'Favor de seleccionar el formato correcto(.xlsx).',
          this.options
        );
        this.inputFile.nativeElement.value = '';
        return;
      }

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

        if (this.dataExcel.length === 0) {
          this.alertService.warn(
            'No hay filas en el archivo seleccionado',
            this.options
          );
          this.inputFile.nativeElement.value = '';
          this.cd.detectChanges();
          return;
        }

        if (this.dataExcel.length > 1) {
          const headers = [
            'ID',
            'DEPARTAMENTO',
            'PROVINCIA',
            'DISTRITO',
            'DIRECCION',
            'TELEFONO',
            'AQUI_GEO_MANUAL',
          ];

          if (
            !headers.every((i) => Object.keys(this.dataExcel[0]).includes(i))
          ) {
            this.alertService.warn(
              `La seleccion de las cabeceras no es la correcta ${headers}`,
              this.options
            );
            this.dataExcel = [];
            this.inputFile.nativeElement.value = '';
            this.cd.detectChanges();
            return;
          }
        }

        this.checkOrders(this.dataExcel.map((r) => r.ID));
        this.cd.detectChanges();
      };

      fileReader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    }
  }

  defaultValues() {
    this.alertService.clear();
    this.dataExcel = [];
    this.formData = new FormData();
    this.proceedOrders = 0;
    this.notProceedOrders = 0;
  }

  checkOrders(codes: string[]) {
    this.orderService.getOrdersByCodes(codes).subscribe((response: any) => {
      const ordersProcessed: any[] = response.data?.map((r: any) => r.code);
      const orders =
        this.dataExcel.filter((r) =>
          ordersProcessed.includes(r.ID.toString())
        ) || [];
      this.proceedOrders = orders.length;
      this.notProceedOrders = this.dataExcel.length - this.proceedOrders;
      this.dataExcel.map((row) => {
        row.PROCEED = ordersProcessed.includes(row.ID.toString());
        return row;
      });
      this.cd.detectChanges();
    });
  }

  onProcesing() {
    this.processService.processFile(this.formData).subscribe((res: any[]) => {
      this.assignationService.setOrderAsignation(res);
      this.router.navigate(['/data-procesing/assignation']);
    });
  }

  onClear() {
    this.alertService.clear();
    this.inputFile.nativeElement.value = '';
    this.defaultValues();
  }
}
