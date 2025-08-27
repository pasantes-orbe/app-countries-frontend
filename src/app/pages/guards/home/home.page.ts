/* ====================================================== */
/* GUARDS/HOME.PAGE.TS */
/* ====================================================== */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavbarGuardsComponent } from 'src/app/components/navbars/navbar-guards/navbar-guards.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    NavbarGuardsComponent
  ]
})
export class HomePage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  navigateToCheckin() {
    this.router.navigate(['/checkin']);
  }

  navigateToAuthorizations() {
    this.router.navigate(['/guards/authorizations']);
  }

  navigateToCheckout() {
    this.router.navigate(['/checkout']);
  }

  navigateToEvents() {
    // NOTA: La ruta se basa en tu archivo app.routes.ts
    this.router.navigate(['/admin/events-historial']);
  }

  logout() {
    console.log('Cerrando sesión del guardia...');
    // Aquí iría la lógica para limpiar el storage y redirigir
    // this.authService.logout();
    this.router.navigate(['/login']);
  }
}
