import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss'],
  standalone: false,
})
export class LogsPage {
  segment: string = 'aktif';
  allOrders: any[] = [];

  constructor(private http: HttpClient, private alertCtrl: AlertController) {}

  // ✅ Lifecycle Ionic: dipanggil setiap kali user masuk ke halaman ini
  ionViewWillEnter(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.http
      .get<any>('http://localhost/suprid_app_backend/public/get_orders.php', {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          if (res.success && Array.isArray(res.orders)) {
            this.allOrders = res.orders;
          } else {
            this.presentAlert(res.message || 'Gagal memuat pesanan.');
          }
        },
        error: () => {
          this.presentAlert('Terjadi kesalahan saat memuat pesanan.');
        },
      });
  }

  get pesananAktif() {
    return this.allOrders.filter((order) => !order.confirmed);
  }

  get riwayatPesanan() {
    return this.allOrders.filter((order) => order.confirmed);
  }

  confirmOrder(orderId: number): void {
    const payload = { order_id: orderId };

    this.http
      .post<any>(
        'http://localhost/suprid_app_backend/public/confirm_order.php',
        payload,
        { withCredentials: true }
      )
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.presentAlert('✅ Pesanan telah dikonfirmasi.');
            this.loadOrders();
          } else {
            this.presentAlert(res.message || 'Konfirmasi pesanan gagal.');
          }
        },
        error: () => {
          this.presentAlert('Terjadi kesalahan saat mengirim konfirmasi.');
        },
      });
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Informasi',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
