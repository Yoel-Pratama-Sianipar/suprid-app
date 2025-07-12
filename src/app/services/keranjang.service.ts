import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: any[] = [];
  private orderHistory: any[] = [];
  private baseUrl = 'http://localhost/suprid_app_backend/public';

  constructor(private http: HttpClient) {}

  getCart(): any[] {
    return this.cartItems;
  }

  addToCart(item: any): void {
    const existing = this.cartItems.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity || 1;
    } else {
      this.cartItems.push({ ...item, quantity: item.quantity || 1 });
    }
  }

  updateCart(updatedItem: any): void {
    const index = this.cartItems.findIndex((i) => i.id === updatedItem.id);
    if (index !== -1) {
      this.cartItems[index] = { ...updatedItem };
    }
  }

  removeFromCart(item: any): void {
    this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  saveOrderLocally(
    paymentMethod: string,
    alamat: string,
    nomorMeja: string
  ): void {
    const lokasi =
      alamat.trim() !== ''
        ? { tipe: 'antar', alamat }
        : { tipe: 'dine-in', nomorMeja };

    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleString(),
      items: this.cartItems.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.basePrice,
        img: item.img,
      })),
      total: this.cartItems.reduce(
        (total, item) => total + item.basePrice * item.quantity,
        0
      ),
      paymentMethod,
      lokasi,
      status: 'dikirim',
      confirmed: false,
    };

    this.orderHistory.unshift(newOrder);
    this.clearCart();
  }

  getOrderHistory(): any[] {
    return this.orderHistory;
  }

  confirmOrder(id: string): void {
    const order = this.orderHistory.find((o) => o.id === id);
    if (order) {
      order.status = 'selesai';
      order.confirmed = true;
    }
  }

  submitOrderToServer(
    paymentMethod: string,
    alamat: string,
    nomorMeja: string
  ): Observable<any> {
    const items = this.cartItems.map((item) => ({
      menu_id: item.id,
      name: item.title,
      quantity: item.quantity,
      price: item.basePrice,
    }));

    const orderPayload = {
      total_price: this.cartItems.reduce(
        (total, item) => total + item.basePrice * item.quantity,
        0
      ),
      payment_method: paymentMethod,
      delivery_address: alamat.trim() !== '' ? alamat.trim() : null,
      table_number: nomorMeja.trim() !== '' ? nomorMeja.trim() : null,
      items,
    };

    return this.http.post(`${this.baseUrl}/orders.php`, orderPayload, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json', // 🔍 Memberi tahu backend data dalam format JSON
      },
    });
  }
}
