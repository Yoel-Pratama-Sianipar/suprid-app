import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsPage } from './tabs.page';
import { IonicModule } from '@ionic/angular';
import { TabsRoutingModule } from './tabs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TabsRoutingModule, // ← Tambahkan ini
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {}
