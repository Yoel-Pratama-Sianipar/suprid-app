import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';

import { AuthHeaderComponent } from './components/auth-header/auth-header.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    AuthHeaderComponent, // ✅ masih bisa diimpor jika ini bukan standalone
    // ❌ Hapus LoginPage dan SignupPage
  ],
  exports: [
    AuthHeaderComponent, // opsional
  ],
})
export class AuthModule {}
