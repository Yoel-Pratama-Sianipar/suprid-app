import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode: boolean = false;

  constructor() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      this.darkMode = savedTheme === 'dark';
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.darkMode = prefersDark.matches;

      // Simpan preferensi awal ke localStorage
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');

      // Pantau perubahan preferensi sistem
      prefersDark.addEventListener('change', (e) => {
        this.setDarkMode(e.matches);
      });
    }

    this.applyTheme();
  }

  setDarkMode(isDark: boolean) {
    this.darkMode = isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  getDarkMode(): boolean {
    return this.darkMode;
  }

  restoreMode() {
    this.applyTheme();
  }

  private applyTheme() {
    document.body.classList.toggle('dark', this.darkMode);
  }
}
