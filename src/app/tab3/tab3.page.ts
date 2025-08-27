//app/tab3/tab3.page.ts
import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Usar componentes standalone en lugar de IonicModule completo
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonList,
  IonItem, IonLabel, IonIcon, IonActionSheet, IonAlert, IonModal,
  IonInput, IonButton, IonButtons
} from '@ionic/angular/standalone';

// Interfaces
import { OwnerResponse } from '../interfaces/ownerResponse-interface';
import { UserInterface } from '../interfaces/user-interface';

// Socket
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

// Servicios
import { UserStorageService } from '../services/storage/user-storage.service';
import { OwnersService } from '../services/owners/owners.service';
import { OwnerStorageService } from '../services/storage/owner-interface-storage.service';
import { AlertService } from '../services/helpers/alert.service';

// Componentes (solo se importan, no se usan en template para evitar warnings)
import { IncomesComponent } from '../components/incomes/incomes.component';
import { RecurrentsViewAllComponent } from '../components/recurrentsViewAll/recurrents-view-all/recurrents-view-all.component';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonList,
      IonItem, IonLabel, IonIcon, IonActionSheet, IonAlert, IonModal,
      IonInput, IonButton, IonButtons
    ]
})
export class Tab3Page implements OnInit {
    private user: UserInterface;
    private userID: string;
    protected owner: OwnerResponse;
    private socket: Socket;
    public recurrentsState = false;

    // Estados para modals/alerts
    public isActionSheetOpen = false;
    public isLogoutAlertOpen = false;
    public isPropertiesModalOpen = false;
    public isSecurityModalOpen = false;
    public isEditProfileModalOpen = false;
    
    // Variables para edición de perfil
    public editName: string = '';
    public editEmail: string = '';
    public editPhone: string = '';
    
    // Variables para cambio de contraseña
    public currentPassword: string = '';
    public newPassword: string = '';
    public confirmPassword: string = '';
    
    // Opciones del action sheet - CORREGIDAS
    public actionSheetButtons = [
      {
        text: 'Editar Información',
        icon: 'create-outline',
        handler: () => {
          this.openEditProfileModal();
          return true;
        }
      },
      {
        text: 'Ver Datos Completos',
        icon: 'eye-outline', 
        handler: () => {
          this.viewFullProfile();
          return true;
        }
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel'
      }
    ];

    // Botones del alert de logout - CORREGIDO
    public logoutAlertButtons = [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          this.cancelLogout();
        }
      },
      {
        text: 'Cerrar Sesión',
        handler: () => {
          this.confirmLogout();
        }
      }
    ];

    // Propiedades simuladas
    public properties = [
      { 
        id: 1, 
        address: 'Av. Principal 123, Torre A, Piso 15, Apto 4A', 
        type: 'Apartamento',
        area: '120 m²',
        status: 'Activa'
      },
      { 
        id: 2, 
        address: 'Calle Secundaria 456, Casa 2', 
        type: 'Casa',
        area: '250 m²',
        status: 'Activa'
      }
    ];

    @ViewChild('incomesComponent') incomesComponent: IncomesComponent;

    constructor(
      private _userStorageService: UserStorageService,
      private _ownersService: OwnersService,
      private _ownerStorageService: OwnerStorageService,
      private alerts: AlertService,
      private router: Router
    ) {
      this.socket = io(environment.URL);
    }

    async ngOnInit() {
      const user = await this._userStorageService.getUser();
      if (user) {
        this.userID = String(user.id);
        this._ownersService.getByID(this.userID).subscribe((owner) => {
          this.owner = owner;
          this._ownerStorageService.saveOwner(owner);
          // Cargar datos para edición
          this.loadEditData();
        });
        this.nuevoPropietarioConectado();
        this.escucharNotificacionesCheckin();
      }
    }

    ionViewWillEnter() {
      if (this.incomesComponent) {
        this.incomesComponent.ngOnInit();
      }
    }

    async escucharNotificacionesCheckin() {
      this.socket.on('notificacion-check-in', async (payload) => {
        console.log(payload);
        await this.alerts.presentAlert(payload);
        if (this.incomesComponent) {
          this.incomesComponent.ngOnInit();
        }
      });
    }

    async nuevoPropietarioConectado() {
      this.socket.emit('owner-connected', this.userID);
    }

    // Cargar datos para edición
    private loadEditData() {
      // Cargar datos reales del owner o usar placeholders
      this.editName = 'Juan Pérez'; // Cambiar por this.owner.name si existe
      this.editEmail = 'juan.perez@email.com'; // Cambiar por this.owner.email si existe
      this.editPhone = '+54 11 1234-5678'; // Cambiar por this.owner.phone si existe
    }

    // ==== FUNCIONES DE LOS BOTONES DEL PERFIL ====

    // Información Personal
    public onPersonalInfoClick() {
      console.log('Información Personal clickeada');
      this.isActionSheetOpen = true;
    }

    // Abrir modal de edición de perfil
    private openEditProfileModal() {
      this.isActionSheetOpen = false;
      this.isEditProfileModalOpen = true;
    }

    // Guardar cambios de perfil
    public saveProfileChanges() {
      if (!this.editName.trim() || !this.editEmail.trim()) {
        this.alerts.presentAlert({
          title: 'Error',
          message: 'Nombre y email son obligatorios'
        });
        return;
      }

      // Aquí harías la llamada al servicio para guardar
      this.alerts.presentAlert({
        title: 'Perfil Actualizado',
        message: 'Los cambios han sido guardados exitosamente'
      });

      this.isEditProfileModalOpen = false;
    }

    // Cerrar modal de edición
    public closeEditProfileModal() {
      this.isEditProfileModalOpen = false;
      this.loadEditData(); // Recargar datos originales
    }

    private viewFullProfile() {
      console.log('Viendo perfil completo...');
      this.isActionSheetOpen = false;
      
      const ownerInfo = this.owner ? {
        id: this.owner.id || 'No disponible',
      } : null;

      this.alerts.presentAlert({
        title: 'Perfil Completo',
        message: `
          <strong>ID Usuario:</strong> ${ownerInfo?.id || 'No disponible'}<br>
          <strong>Nombre:</strong> ${this.editName}<br>
          <strong>Email:</strong> ${this.editEmail}<br>
          <strong>Teléfono:</strong> ${this.editPhone}<br>
          <strong>Estado:</strong> Activo<br>
          <strong>Tipo:</strong> Propietario
        `
      });
    }

    // Mis Propiedades - CORREGIDA
    public onMyPropertiesClick() {
      console.log('Mis Propiedades clickeada');
      this.isPropertiesModalOpen = true;
    }

    // Cerrar modal de propiedades
    public closePropertiesModal() {
      this.isPropertiesModalOpen = false;
    }

    // Seguridad y Contraseña - CORREGIDA
    public onSecurityClick() {
      console.log('Seguridad y Contraseña clickeada');
      this.isSecurityModalOpen = true;
    }

    // Cambiar contraseña
    public changePassword() {
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        this.alerts.presentAlert({
          title: 'Error',
          message: 'Todos los campos son obligatorios'
        });
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.alerts.presentAlert({
          title: 'Error',
          message: 'Las contraseñas no coinciden'
        });
        return;
      }

      if (this.newPassword.length < 6) {
        this.alerts.presentAlert({
          title: 'Error',
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
        return;
      }

      // Aquí harías la llamada al servicio
      this.alerts.presentAlert({
        title: 'Contraseña Actualizada',
        message: 'Su contraseña ha sido cambiada exitosamente'
      });

      this.closeSecurityModal();
    }

    // Cerrar modal de seguridad
    public closeSecurityModal() {
      this.isSecurityModalOpen = false;
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }

    // Cerrar Sesión
    public onLogoutClick() {
      console.log('Cerrar Sesión clickeada');
      this.isLogoutAlertOpen = true;
    }

    // Confirmar logout - CORREGIDO
    public async confirmLogout() {
      console.log('Cerrando sesión...');
      this.isLogoutAlertOpen = false;
      
      try {
        // Desconectar socket
        if (this.socket) {
          this.socket.disconnect();
        }
        
        // Limpiar storage local (descomenta si tienes estos métodos)
        await this._userStorageService.removeUser();
        await this._ownerStorageService.signOut();
        
        //Limpiar variables locales
        this.user = null;
        this.userID = '';
        this.owner = null;

        // Redirigir al login INMEDIATAMENTE
        await this.router.navigate(['/login', { replaceUrl: true }]);
        
        // Mostrar mensaje después de redirigir
        setTimeout(() => {
          this.alerts.presentAlert({
            title: 'Sesión Cerrada',
            message: 'Gracias por usar Zentry. ¡Hasta pronto!'
          });
        }, 500);
        
      } catch (error) {
        console.error('Error cerrando sesión:', error);
        this.alerts.presentAlert({
          title: 'Error',
          message: 'Hubo un problema al cerrar la sesión. Intente nuevamente.'
        });
      }
    }

    // Cancelar logout
    public cancelLogout() {
      this.isLogoutAlertOpen = false;
      console.log('Logout cancelado');
    }

    // ==== FUNCIONES ADICIONALES ====

    // Ver recurrentes (función existente mejorada)
    public viewRecurrents() {
      this.recurrentsState = !this.recurrentsState;
      console.log('Estado recurrentes:', this.recurrentsState ? 'Abierto' : 'Cerrado');
    }

    // Función para obtener la inicial del nombre para el avatar
    public getAvatarInitial(): string {
      if (this.editName) {
        return this.editName.charAt(0).toUpperCase();
      }
      if (this.owner && this.owner.id) {
        return String(this.owner.id).charAt(0).toUpperCase();
      }
      return 'U';
    }

    // Función para obtener el nombre completo o placeholder
    public getOwnerName(): string {
      return this.editName || 'Propietario';
    }

    // Función para obtener la información de la propiedad
    public getPropertyInfo(): string {
      return `${this.properties.length} propiedad${this.properties.length !== 1 ? 'es' : ''} registrada${this.properties.length !== 1 ? 's' : ''}`;
    }

    // Limpiar recursos al salir
    ngOnDestroy() {
      if (this.socket) {
        this.socket.disconnect();
      }
    }
}