import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ROLES } from '@core/enums/roles';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  username!: string;

  adminRoutes = [
    { link: '/dashboard', name: 'Dashboard', icon: 'fa-chart-line' },
    {
      link: '/data-procesing',
      name: 'Data Procesing',
      icon: 'fa-arrow-up-right-dots',
    },
    {
      link: '/data-monitoring',
      name: 'Data Monitoring',
      icon: 'fa-print',
    },
    { link: '/configuration', name: 'Configuración', icon: 'fa-gears' },
  ];

  driverRoutes = [{ link: '/orders', name: 'Pedidos', icon: 'fa-shop' }];

  logoRoute = '';

  routes: any[] = [];

  constructor(private router: Router, private authService: AuthService) {}
  @ViewChild('navBurger') navBurger!: ElementRef;
  @ViewChild('navMenu') navMenu!: ElementRef;

  ngOnInit(): void {
    this.username = localStorage.getItem('user') as unknown as string;
    this.validateRole();
  }
  validateRole() {
    if (this.authService.getRole() === ROLES.ADMIN) {
      this.routes = this.adminRoutes;
      this.logoRoute = '/dashboard';
      return;
    }
    this.routes = this.driverRoutes;
    this.logoRoute = '/orders';
  }

  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
