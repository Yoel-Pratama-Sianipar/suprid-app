import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UserService } from '../../core/services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profiles',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilesPage {
  user: any = null;
  isDarkMode: boolean = false;
  favoriteMenus: any[] = [];
  favorites: any[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private themeService: ThemeService,
    private http: HttpClient // ✅ tambahkan ini untuk request manual
  ) {}

  ionViewWillEnter() {
    this.user = this.userService.getUser() ?? null;
    this.loadFavorites();

    if (this.user) {
      this.authService.getFavorites().subscribe(
        (res: any) => {
          this.favoriteMenus = res.success ? res.favorites : [];
        },
        () => {
          this.favoriteMenus = [];
        }
      );
    }
  }

  refreshUser() {
    const userId = this.user?.id;
    if (!userId) return;

    this.authService.getUserById(userId).subscribe((res) => {
      if (res.success && res.user) {
        this.user = res.user;
        this.userService.setUser(res.user);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    });
  }

  async editUsername() {
    const alert = await this.alertController.create({
      header: 'Ganti Username',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Username baru',
          value: this.user?.username || '',
        },
      ],
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Simpan',
          handler: (data) => {
            if (data.username) {
              this.updateUserData({ username: data.username });
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editPhone() {
    const alert = await this.alertController.create({
      header: 'Ganti No. Telepon',
      inputs: [
        {
          name: 'phone',
          type: 'tel',
          placeholder: 'Nomor baru',
          value: this.user?.phone || '',
        },
      ],
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Simpan',
          handler: (data) => {
            if (data.phone) {
              this.updateUserData({ phone: data.phone });
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editAddress() {
    const alert = await this.alertController.create({
      header: 'Ganti Alamat',
      inputs: [
        {
          name: 'address',
          type: 'text',
          placeholder: 'Alamat baru',
          value: this.user?.address || '',
        },
      ],
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Simpan',
          handler: (data) => {
            if (data.address) {
              this.updateUserData({ address: data.address });
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editPassword() {
    const alert = await this.alertController.create({
      header: 'Ganti Password',
      inputs: [
        {
          name: 'old_password',
          type: 'password',
          placeholder: 'Password lama',
        },
        {
          name: 'new_password',
          type: 'password',
          placeholder: 'Password baru',
        },
      ],
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Simpan',
          handler: (data) => {
            if (!data.old_password || !data.new_password) {
              this.showToast('Semua kolom wajib diisi');
              return false;
            }

            this.authService.updatePassword(data).subscribe(
              (res: any) => {
                this.showToast(
                  res.success
                    ? 'Password berhasil diperbarui'
                    : res.message || 'Gagal mengganti password'
                );
              },
              () => this.showToast('Terjadi kesalahan saat mengupdate password')
            );
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  updateUserData(data: any) {
    const payload = { ...this.user, ...data };

    this.authService.updateUser(payload).subscribe(
      (res: any) => {
        if (res.success) {
          this.user = res.user ?? this.user;
          this.userService.setUser(this.user);
          this.showToast('Data berhasil diperbarui');
        } else {
          this.showToast(res.message || 'Gagal menyimpan perubahan');
        }
      },
      () => {
        this.showToast('Terjadi kesalahan saat mengupdate');
      }
    );
  }

  async showToast(msg: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

  changeProfilePic() {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_pic', file);

    this.authService.updateProfilePicture(formData).subscribe(
      (res) => {
        if (res.success) {
          this.user.profile_pic = res.profile_pic;
          this.userService.setUser(this.user);
          this.refreshUser();
          this.showToast('Foto profil berhasil diperbarui');
        } else {
          this.showToast('Gagal upload foto: ' + res.message, 'danger');
        }
      },
      () => this.showToast('Terjadi kesalahan saat upload', 'danger')
    );
  }

  getProfilePicUrl(path: string): string {
    return path
      ? `http://localhost/suprid_app_backend/${path}`
      : 'assets/IMG_20250218_114427.png';
  }

  onImageError(event: any) {
    event.target.src = 'assets/IMG_20250218_114427.png';
  }

  loadFavorites() {
    this.authService.getFavorites().subscribe(
      (res) => {
        if (res.success) {
          this.favorites = res.favorites;
        }
      },
      () => {
        this.favorites = [];
      }
    );
  }

  toggleTheme(event: any) {
    const isDark = event.detail.checked;
    this.isDarkMode = isDark;
    this.themeService.setDarkMode(isDark);
  }

  // ✅ Fungsi hapus favorit langsung dari profil
  removeFavorite(item: any) {
    this.http
      .post(
        'http://localhost/suprid_app_backend/public/remove_favorite.php',
        { menu_id: item.id },
        { withCredentials: true }
      )
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.favorites = this.favorites.filter((fav) => fav.id !== item.id);
            this.showToast('Menu dihapus dari favorit');
          } else {
            this.showToast('Gagal menghapus menu favorit', 'danger');
          }
        },
        () => {
          this.showToast('Terjadi kesalahan saat menghapus', 'danger');
        }
      );
  }
}
