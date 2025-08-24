//src/app/routes/routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [


  {
    path: '',
    redirectTo: 'splash-screen',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'splash-screen',
    loadComponent: () =>
      import('../pages/splash-screen/splash-screen.page').then(m => m.SplashScreenPage)
  },
  {
    path: 'incomes',
    loadComponent: () =>
      import('../pages/registrations/incomes/incomes.page').then(m => m.IncomesPage)
  },
  {
    path: 'politica-de-privacidad',
    loadComponent: () =>
      import('../pages/politica-de-privacidad/politica-de-privacidad.page').then(m => m.PoliticaDePrivacidadPage)
  },
  {
    path: 'auth-incomes',
    loadComponent: () =>
      import('../pages/incomes/auth-incomes/auth-incomes.page').then(m => m.AuthIncomesPage)
  },
  {
    path: 'new-income',
    loadComponent: () =>
      import('../pages/incomes/new-income/new-income.page').then(m => m.NewIncomePage)
  },
  {
    path: 'guards-schedule',
    loadComponent: () =>
      import('../pages/guardsSchedule/guards-schedule/guards-schedule.page').then(m => m.GuardsSchedulePage)
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('../pages/guards/checkout/checkout.page').then(m => m.CheckoutPage)
  },
  {
    path: 'checkin',
    loadComponent: () =>
      import('../pages/guards/checkin/checkin.page').then(m => m.CheckinPage)
  },
  {
    path: 'guards/authorizations',
    loadComponent: () =>
      import('../pages/guards/authorizations/authorizations.page').then(m => m.AuthorizationsPage)
  },
  {
    path: 'guards/home',
    loadComponent: () =>
      import('../pages/guards/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'view-events',
    loadComponent: () =>
      import('../pages/guards/events/view-events/view-events.page').then(m => m.ViewEventsPage)
  },
  {
    path: 'check-in-and-check-out',
    loadComponent: () =>
      import('../pages/guards/menu/registers/check-in-and-check-out/check-in-and-check-out.page').then(m => m.CheckInAndCheckOutPage)
  },
  {
    path: 'guards/authorizations',
    loadComponent: () =>
      import('../pages/guards/authorizations/authorizations.page').then(m => m.AuthorizationsPage)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then(m => m.Tab1Page)
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then(m => m.Tab2Page)
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then(m => m.Tab3Page)
      },
      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'admin/home',
    loadComponent: () =>
      import('../pages/admin/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'event-reservation',
    loadComponent: () =>
      import('../pages/event-reservation/event-reservation.page').then(m => m.EventReservationPage)
  },
  {
    path: 'download',
    loadComponent: () =>
      import('../pages/download/download.page').then(m => m.DownloadPage)
  },
  {
    path: 'map-guards',
    loadComponent: () =>
      import('../pages/admin/map-guards/map-guards.page').then(m => m.MapGuardsPage)
  },
  {
    path: 'admin/add-country',
    loadComponent: () =>
      import('../pages/admin/add-country/add-country.page').then(m => m.AddCountryPage)
  },
  {
    path: 'admin/add-amenity',
    loadComponent: () =>
      import('../pages/admin/country-amenities/add-amenity/add-amenity.page').then(m => m.AddAmenityPage)
  },
  {
    path: 'admin/view-all-amenities',
    loadComponent: () =>
      import('../pages/admin/country-amenities/view-all/view-all.page').then(m => m.ViewAllPage)
  },
  {
    path: 'admin/country-dashboard',
    loadComponent: () =>
      import('../pages/admin/country-dashboard/country-dashboard.page').then(m => m.CountryDashboardPage)
  },
  {
    path: 'admin/add-country-owner',
    loadComponent: () =>
      import('../pages/admin/country-owners/add-country-owner/add-country-owner.page').then(m => m.AddCountryOwnerPage)
  },
  {
    path: 'admin/assign-country-to-owner',
    loadComponent: () =>
      import('../pages/admin/country-owners/assign-country-to-owner/assign-country-to-owner.page').then(m => m.AssignCountryToOwnerPage)
  },
  {
    path: 'admin/view-owners',
    loadComponent: () =>
      import('../pages/admin/country-owners/view/view.page').then(m => m.ViewPage)
  },
  {
    path: 'admin/add-property',
    loadComponent: () =>
      import('../pages/admin/country-properties/add-property/add-property.page').then(m => m.AddPropertyPage)
  },
  {
    path: 'admin/view-properties',
    loadComponent: () =>
      import('../pages/admin/country-properties/view/view.page').then(m => m.ViewPage)
  },
  {
    path: 'admin/add-recurrent',
    loadComponent: () =>
      import('../pages/admin/country-recurrents/add-recurrent/add-recurrent.page').then(m => m.AddRecurrentPage)
  },
  {
    path: 'admin/country-recurrents',
    loadComponent: () =>
      import('../pages/admin/country-recurrents/country-recurrents.page').then(m => m.RecurrentsViewAllComponent)
  },
  {
    path: 'admin/events-historial',
    loadComponent: () =>
      import('../pages/admin/events-segment/events-historial/events-historial.page').then(m => m.EventsHistorialPage)
  },
  {
    path: 'admin/add-guard',
    loadComponent: () =>
      import('../pages/admin/guard-segment/add-guard/add-guard.page').then(m => m.AddGuardPage)
  },
  {
    path: 'admin/add-laboral-schedule',
    loadComponent: () =>
      import('../pages/admin/guard-segment/add-laboral-schedule/add-laboral-schedule.page').then(m => m.AddLaboralSchedulePage)
  },
  {
    path: 'admin/all-guards',
    loadComponent: () =>
      import('../pages/admin/guard-segment/all-guards/all-guards.page').then(m => m.AllGuardsPage)
  },
  {
    path: 'admin/antipanic-historial',
    loadComponent: () =>
      import('../pages/admin/guard-segment/antipanic-historial/antipanic-historial.page').then(m => m.AntipanicHistorialPage)
  },
  {
    path: 'admin/checkin-out-historial',
    loadComponent: () =>
      import('../pages/admin/guard-segment/checkin-out-historial/checkin-out-historial.page').then(m => m.CheckinOutHistorialPage)
  },
  {
    path: 'admin/password-requests',
    loadComponent: () =>
      import('../pages/admin/password-requests/password-requests/password-requests.page').then(m => m.PasswordRequestsPage)
  },
  {
    path: 'account/edit',
    loadComponent: () =>
      import('../pages/account/edit/edit.page').then(m => m.EditPage)
  },
  {
    path: 'account/password-change',
    loadComponent: () =>
      import('../pages/account/password-change/password-change.page').then(m => m.PasswordChangePage)
  },
  {
    path: 'edit-owner/:id',
    loadComponent: () =>
      import('../modals/owners/edit/edit.page').then(m => m.EditPage)
  },
  {
    path: 'explore-container',
    loadComponent: () =>
      import('../explore-container/explore-container.component').then(m => m.ExploreContainerComponent)
  },
  {
    path: '**',
    redirectTo: 'splash-screen'
  }
];