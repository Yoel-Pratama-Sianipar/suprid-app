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
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { ThemeService } from 'src/app/core/services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    AuthHeaderComponent,
  ],
})
export class SignupPage {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      address: ['', Validators.required],
    });

    this.themeService.restoreMode();
  }

  onSignup() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;

      if (formData.password !== formData.confirmPassword) {
        this.presentAlert('Password dan konfirmasi password tidak cocok!');
        return;
      }

      const { confirmPassword, ...userToSave } = formData;

      this.authService.signup(userToSave).subscribe(
        (res) => {
          if (res.success) {
            this.presentAlert('Registrasi berhasil! Silakan login.', true);
          } else {
            this.presentAlert(res.message || 'Gagal registrasi.');
          }
        },
        () => {
          this.presentAlert('Terjadi kesalahan saat menghubungi server.');
        }
      );
    } else {
      this.presentAlert('Form belum lengkap atau valid!');
    }
  }

  async presentAlert(message: string, redirectToLogin: boolean = false) {
    const alert = await this.alertCtrl.create({
      header: 'Pendaftaran',
      message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (redirectToLogin) {
              this.router.navigate(['/auth/login']);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
