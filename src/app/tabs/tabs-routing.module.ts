import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../pages/home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'keranjang',
        loadChildren: () =>
          import('../pages/keranjang/keranjang.module').then(
            (m) => m.KeranjangPageModule
          ),
      },
      {
        path: 'log',
        loadChildren: () =>
          import('../pages/logs/log.module').then((m) => m.LogsPageModule),
      },
      {
        path: 'profile', // ✅ GANTI dari 'profiles' ke 'profile'
        loadChildren: () =>
          import('../pages/profiles/profile.module').then(
            (m) => m.ProfilesPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
