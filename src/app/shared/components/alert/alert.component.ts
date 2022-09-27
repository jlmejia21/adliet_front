import { Component, Input, OnInit } from '@angular/core';
import { Alert, AlertType } from '@core/interfaces/alert';
import { AlertService } from '@core/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription!: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService
      .onAlert(this.id)
      .subscribe((alert) => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          // filter out alerts without 'keepAfterRouteChange' flag
          this.alerts = this.alerts.filter((x) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          this.alerts.forEach((x) => delete x.keepAfterRouteChange);
          return;
        }

        // add alert to array
        this.alerts.push(alert);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 1500);
        }
      });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    debugger;
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) return;

    if (this.fade) {
      // fade out alert
      this.alerts.find((x) => x === alert)!.fade = true;

      // remove alert after faded out
      setTimeout(() => {
        this.alerts = this.alerts.filter((x) => this.isEqual(x, alert));
      }, 250);
    } else {
      // remove alert
      this.alerts = this.alerts.filter((x) => x !== alert);
    }
  }

  cssClass(alert: Alert) {
    if (!alert) return;

    const classes = ['notification', 'alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'is-success is-light',
      [AlertType.Error]: 'is-danger',
      [AlertType.Info]: 'is-info',
      [AlertType.Warning]: 'is-warning ',
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }

  isEqual(obj1: any, obj2: any) {
    var props1 = Object.getOwnPropertyNames(obj1);
    var props2 = Object.getOwnPropertyNames(obj2);
    if (props1.length != props2.length) {
      return false;
    }
    for (var i = 0; i < props1.length; i++) {
      let val1 = obj1[props1[i]];
      let val2 = obj2[props1[i]];
      let isObjects = this.isObject(val1) && this.isObject(val2);
      if (
        (isObjects && !this.isEqual(val1, val2)) ||
        (!isObjects && val1 !== val2)
      ) {
        return false;
      }
    }
    return true;
  }

  isObject(object: any) {
    return object != null && typeof object === 'object';
  }
}
