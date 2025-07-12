import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost/suprid_app_backend/public';

  constructor(private http: HttpClient, private userService: UserService) {}

  // ✅ Login
  login(email: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/login.php`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((res: any) => {
          if (res.success && res.user) {
            this.userService.setUser(res.user);
          }
        })
      );
  }

  // ✅ Register
  signup(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register.php`, data, {
      withCredentials: true,
    });
  }

  // ✅ Logout
  logout(): Observable<any> {
    this.userService.clearUser(); // bersihkan state lokal
    return this.http.post(
      `${this.baseUrl}/logout.php`,
      {},
      { withCredentials: true }
    );
  }

  // ✅ Update profil (username, alamat, dll)
  updateUser(data: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/update_user.php`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((res: any) => {
          if (res.success && res.user) {
            this.userService.setUser(res.user);
          }
        })
      );
  }

  // ✅ Ganti password
  updatePassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_password.php`, data, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ✅ Ganti foto profil
  updateProfilePicture(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_profile_pic.php`, formData, {
      withCredentials: true,
    });
  }

  // ✅ Ambil data user dari server (menggunakan session di cookie)
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user.php?user_id=${id}`, {
      withCredentials: true,
    });
  }

  // ✅ Ambil daftar favorit user
  getFavorites(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_favorites.php`, {
      withCredentials: true,
    });
  }
}
