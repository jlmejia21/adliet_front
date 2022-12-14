import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@core/interfaces/store';
import { AlertService } from '@core/services/alert.service';
import { StoreService } from '@core/services/store.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationComponent implements OnInit {
  formTienda: FormGroup;
  stores: any[] = [];
  storeSelected!: Store;
  options = {
    autoClose: true,
  };
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private cd: ChangeDetectorRef,
    public alertService: AlertService
  ) {
    this.formTienda = this.fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      direction: [null, Validators.required],
      latitude: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/
          ),
        ],
      ],
      longitude: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/
          ),
        ],
      ],
    });
  }

  getStores() {
    this.storeService.getAll().subscribe((stores) => {
      this.stores = stores;
      this.cd.detectChanges();
    });
  }

  ngOnInit(): void {
    this.getStores();
  }

  onEdit(store: Store) {
    this.storeSelected = store;
    this.formTienda.get('code')?.setValue(store.code);
    this.formTienda.get('name')?.setValue(store.name);
    this.formTienda.get('direction')?.setValue(store.direction);
    this.formTienda.get('latitude')?.setValue(store.latitude);
    this.formTienda.get('longitude')?.setValue(store.longitude);
    this.cd.markForCheck();
  }

  onSubmit() {
    this.currentPage = 1;
    this.alertService.clear();
    if (this.formTienda.invalid) return;

    if (
      this.formTienda.get('latitude')?.value === this.storeSelected.latitude &&
      this.formTienda.get('longitude')?.value === this.storeSelected.longitude
    ) {
      this.alertService.warn('Favor, de editar los campos', this.options);
      this.cd.markForCheck();

      return;
    }

    const editStore: Partial<Store> = {
      latitude: this.formTienda.get('latitude')?.value,
      longitude: this.formTienda.get('longitude')?.value,
    };

    this.storeService
      .edit(this.storeSelected.id, editStore)
      .subscribe((response) => {
        this.alertService.success(
          'Se guardaron los datos correctamente!',
          this.options
        );
        this.getStores();
        this.formTienda.reset();
        this.cd.markForCheck();
      });
  }
}
