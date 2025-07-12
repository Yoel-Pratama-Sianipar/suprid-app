import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CartService } from '../../services/keranjang.service';

@Component({
  selector: 'app-keranjang',
  templateUrl: './keranjang.page.html',
  styleUrls: ['./keranjang.page.scss'],
  standalone: false,
})
export class KeranjangPage implements OnInit {
  cartItems: any[] = [];
  selectedPayment: string = 'qris';

  alamatPengiriman: string = '';
  nomorMeja: string = '';
  mejaOptions: string[] = [];

  constructor(
    private cartService: CartService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
    this.generateMejaOptions();
  }

  get totalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.basePrice * item.quantity,
      0
    );
  }

  increaseQty(item: any): void {
    item.quantity++;
    this.cartService.updateCart(item);
  }

  decreaseQty(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(item);
    }
  }

  removeItem(index: number): void {
    const removed = this.cartItems.splice(index, 1)[0];
    this.cartService.removeFromCart(removed);
  }

  generateMejaOptions(): void {
    const result: string[] = [];

    for (let i = 1; i <= 15; i++)
      result.push(`L1-M${i.toString().padStart(2, '0')}`);
    result.push('L1-VIP');

    for (let i = 1; i <= 10; i++)
      result.push(`L2-M${i.toString().padStart(2, '0')}`);
    result.push('L2-VIP');

    for (let i = 1; i <= 5; i++)
      result.push(`L3-M${i.toString().padStart(2, '0')}`);
    result.push('L3-VIP');

    this.mejaOptions = result;
  }

  async checkout(): Promise<void> {
    if (this.cartItems.length === 0) {
      this.presentAlert(
        'Keranjang kosong. Silakan tambahkan menu terlebih dahulu.'
      );
      return;
    }

    const alamatTerisi = this.alamatPengiriman.trim() !== '';
    const mejaTerisi = this.nomorMeja.trim() !== '';

    if (alamatTerisi && mejaTerisi) {
      this.presentAlert(
        'Silakan isi hanya salah satu: alamat pengiriman ATAU nomor meja.'
      );
      return;
    }

    if (!alamatTerisi && !mejaTerisi) {
      this.presentAlert(
        'Silakan isi lokasi Anda: alamat pengiriman atau nomor meja.'
      );
      return;
    }

    this.cartService
      .submitOrderToServer(
        this.selectedPayment,
        this.alamatPengiriman,
        this.nomorMeja
      )
      .subscribe({
        next: async (res: any) => {
          if (res.success) {
            this.cartItems = [];
            this.alamatPengiriman = '';
            this.nomorMeja = '';
            this.cartService.clearCart();
            this.presentAlert('✅ Pesanan berhasil dibuat!');
          } else {
            this.presentAlert('❌ Gagal membuat pesanan.');
          }
        },
        error: async (err: any) => {
          try {
            const body =
              typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
            if (body?.success) {
              this.cartItems = [];
              this.alamatPengiriman = '';
              this.nomorMeja = '';
              this.cartService.clearCart();
              this.presentAlert('✅ Pesanan berhasil dibuat (fallback)!');
            } else {
              this.presentAlert('❌ Gagal membuat pesanan (fallback).');
            }
          } catch (e) {
            this.presentAlert('Terjadi kesalahan saat mengirim pesanan.');
          }
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
