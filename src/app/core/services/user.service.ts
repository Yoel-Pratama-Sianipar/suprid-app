import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: any = null;

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const storedUser = sessionStorage.getItem('user_data');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch {
        this.user = null;
      }
    }
  }

  setUser(data: any) {
    this.user = data;
    sessionStorage.setItem('user_data', JSON.stringify(data));
  }

  getUser() {
    if (!this.user) {
      this.loadUserFromStorage();
    }
    return this.user;
  }

  clearUser() {
    this.user = null;
    sessionStorage.removeItem('user_data');
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}
