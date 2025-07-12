import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProfilesPageRoutingModule } from './profile-routing.module';
import { ProfilesPage } from './profile.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProfilesPageRoutingModule],
  declarations: [ProfilesPage],
})
export class ProfilesPageModule {}
