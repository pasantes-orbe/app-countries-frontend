import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { MenuController } from '@ionic/angular';

// Interfaces
import { UserInterface } from 'src/app/interfaces/user-interface';

// Servicios - COMENTAR LOS QUE REQUIEREN SERVIDOR:
import { NavigationService } from 'src/app/helpers/navigation.service';
// import { NotificationsService } from 'src/app/services/notifications/notifications.service';
// import { PushService } from 'src/app/services/pushNotifications/push.service';
// import { CountryStorageService } from 'src/app/services/storage/country-storage.service';
// import { IntervalStorageService } from 'src/app/services/storage/interval-storage.service';
// import { UserStorageService } from 'src/app/services/storage/user-storage.service';
// import { WebSocketService } from 'src/app/services/websocket/web-socket.service';

@Component({
    selector: 'app-navbar-guards',
    templateUrl: './navbar-guards.component.html',
    styleUrls: ['./navbar-guards.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class NavbarGuardsComponent implements OnInit {

    protected user: UserInterface;
    protected notifications: any[] = [];
    protected id_user: any;
    public countryName: string = "ZENTRY"; // VALOR TEMPORAL
    public dropdownState: boolean = false;

    constructor(
        public router: Router,
        // COMENTAR SERVICIOS QUE REQUIEREN SERVIDOR:
        // protected _userStorage: UserStorageService,
        private menu: MenuController,
        // private _socketService: WebSocketService,
        // protected _countryStorage: CountryStorageService,
        // protected _intervalStorageService: IntervalStorageService,
        // private _pushService: PushService,
        // private _notificationService: NotificationsService
    ) { }

    async ngOnInit() {
        // COMENTAR TODO LO QUE REQUIERE SERVIDOR:
        /*
        const country = await this._countryStorage.getCountry();
        this.countryName = country.name;

        this.setUser(await this._userStorage.getUser());

        this.id_user = (await this._userStorage.getUser()).id;

        this._notificationService.getAllByUser(this.id_user).subscribe(
            res => {
                this.notifications = res.slice((res.length - 5), (res.length));
                this.notifications = this.notifications.reverse();
            }
        );

        const timerID = await this._intervalStorageService.getInterval_id();
        */
    }

    ionViewWillEnter() {
        // Implementar si es necesario
    }

    async signOut() {
        // SIMPLIFICAR PARA SOLO REDIRIGIR:
        this.router.navigate(['/login']);
        
        // COMENTAR TODO LO DEMÁS:
        /*
        const user = this.getUser();
        const timerID = await this._intervalStorageService.getInterval_id();

        await this._intervalStorageService.remove();
        window.clearInterval(timerID);
        this._socketService.disconnectGuardUbication(user.id);
        this._userStorage.signOut();
        this._countryStorage.signOut();
        if (Capacitor.getPlatform() == 'android') {
            this._pushService.removeOneSignalID();
        }
        */
    }

    protected navigate(url: string): void {
        this.router.navigate([url]);
    }

    protected openEnd(): void {
        this.menu.open('end');
    }

    protected openCustom(): void {
        this.menu.enable(true, 'custom');
        this.menu.open('custom');
    }

    protected openFirst(id: string): void {
        this.menu.enable(true, id);
        this.menu.open(id);
    }

    public getUser(): UserInterface {
        return this.user;
    }

    private setUser(user: UserInterface): void {
        this.user = user;
    }

    public dropdown() {
        this.dropdownState = !this.dropdownState;
    }

    public deleteNotification(noti: any, i: number) {
        console.log("Eliminado", noti, i);
        this.notifications.splice(i, 1);
    }

    public updateNotifications() {
        // COMENTAR:
        /*
        this._notificationService.getAllByUser(this.id_user).subscribe(
            res => {
                console.log(res);
                this.notifications = res;
            }
        );
        */
    }
}