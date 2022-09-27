import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { OrderService } from '@core/services/order.service';
import { StoreService } from '@core/services/store.service';
import { AlertModule } from '@shared/components/alert/alert.module';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
  formSave: FormGroup;
  tiendaControl: FormControl = new FormControl('');
  pedidos: any[] = [];

  options = {
    autoClose: false,
  };

  constructor(
    private orderService: OrderService,
    public alertService: AlertService,
    public authService: AuthService,
    public storeService: StoreService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.formSave = this.fb.group({
      completed: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.getStore();
    this.onSearch();
  }

  getStore() {
    const store = this.authService.getStore();
    this.storeService.getById(Number(store)).subscribe((res) => {
      this.tiendaControl.setValue(res.name);
      this.cd.markForCheck();
    });
  }

  onSearch() {
    const store = this.authService.getStore();
    this.orderService.search(store).subscribe((pedidos) => {
      this.pedidos = pedidos;
      this.cd.markForCheck();
    });
  }

  onCheckChange(event: any) {
    this.alertService.clear();
    const formArray: FormArray = this.formSave.get('completed') as FormArray;

    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      let i: number = 0;
      formArray.controls.forEach((ctrl: any) => {
        if (ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onSubmit() {
    this.alertService.clear();
    const ordersToSend = this.formSave.value?.completed;

    if (ordersToSend.length === 0) {
      this.alertService.warn(
        'Favor de seleccion al menos un pedido.',
        this.options
      );
      return;
    }
    ordersToSend.forEach((id: number) => {});

    const obserbables = ordersToSend.map((id: number) =>
      this.orderService.update(id)
    );

    forkJoin([...obserbables]).subscribe((res) => {
      this.alertService.success(
        'Se guardaron los datos correctamente!',
        this.options
      );
      this.onSearch();
      this.cd.markForCheck();
    });
  }
}
