import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false, // Standalone tidak digunakan di sini karena ini adalah halaman tab yang memiliki routing anak
})
export class TabsPage {
  constructor(private router: Router) {
    // ✅ DEBUG: Cek isi sessionStorage saat Tabs dimuat
    // console.log(' Token:', sessionStorage.getItem('auth_token'));
    //console.log(' User:', sessionStorage.getItem('user_data'));
  }

  reloadProfile() {
    this.router.navigateByUrl('/tabs/profile', { replaceUrl: true }); // ✅ BENAR
  }
}
