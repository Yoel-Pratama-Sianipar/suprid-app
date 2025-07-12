import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { ThemeService } from 'src/app/core/services/theme.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    AuthHeaderComponent,
  ],
})
export class LoginPage {
  loginForm: FormGroup;
  isDarkMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private alertController: AlertController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.isDarkMode = this.themeService.getDarkMode();
    this.themeService.setDarkMode(this.isDarkMode);
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe(
        (res) => {
          if (res.success) {
            sessionStorage.setItem('session_id', res.session_id);
            sessionStorage.setItem('user_id', res.user_id);
            this.userService.setUser(res.user);

            this.router.navigate(['/tabs/home'], { replaceUrl: true });
          } else {
            this.presentAlert(res.message || 'Email atau password salah!');
          }
        },
        () => {
          this.presentAlert('Terjadi kesalahan koneksi ke server.');
        }
      );
    } else {
      this.presentAlert('Silakan isi email dan password dengan benar!');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Peringatan',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  toggleTheme(event: any) {
    const isDark = event.detail.checked;
    this.isDarkMode = isDark;
    this.themeService.setDarkMode(isDark);
  }
}
