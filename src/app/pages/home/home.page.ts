import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';
import { CartService } from '../../services/keranjang.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  searchTerm: string = '';
  menus: any[] = [];
  loading: HTMLIonLoadingElement | null = null;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMenus();
  }

  async loadMenus() {
    await this.presentLoading();

    this.http
      .get<any>(
        'http://localhost/suprid_app_backend/controllers/get_menus.php',
        {
          withCredentials: true,
        }
      )
      .subscribe(
        async (response) => {
          if (response.status === 'success') {
            this.menus = response.data.map((item: any) => ({
              ...item,
              img: `http://localhost/suprid_app_backend/public/uploads/menus/${item.image}`,
              quantity: 0,
              isFavorite: false,
              inCart: false,
            }));
          }
          await this.dismissLoading();
        },
        async () => {
          await this.dismissLoading();
          this.presentAlert('Gagal memuat data menu dari server.');
        }
      );
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Memuat menu...',
      spinner: 'crescent',
      cssClass: 'custom-loading',
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Peringatan',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  toggleFavorite(item: any) {
    const isAdding = !item.isFavorite;
    const url = isAdding
      ? 'http://localhost/suprid_app_backend/public/add_favorite.php'
      : 'http://localhost/suprid_app_backend/public/remove_favorite.php';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .post<any>(url, JSON.stringify({ menu_id: item.id }), {
        headers,
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            item.isFavorite = isAdding;
          } else {
            this.presentAlert('Gagal memperbarui status favorit.');
          }
        },
        error: () => {
          this.presentAlert('Terjadi kesalahan saat mengubah favorit.');
        },
      });
  }

  toggleCart(item: any) {
    item.inCart = !item.inCart;

    if (item.inCart && item.quantity === 0) {
      item.quantity = 1;
      this.cartService.addToCart(item);
    } else if (!item.inCart) {
      item.quantity = 0;
      this.cartService.removeFromCart(item);
    }
  }

  get filteredMenus() {
    const filtered = this.menus.filter((menu) =>
      menu.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    const chunkSize = 3;
    const chunked = [];
    for (let i = 0; i < filtered.length; i += chunkSize) {
      chunked.push(filtered.slice(i, i + chunkSize));
    }

    return chunked;
  }

  trackByFn(index: number, item: any): string {
    return item.title;
  }
}
