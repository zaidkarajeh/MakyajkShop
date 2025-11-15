import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductDTO } from '../model/ProductDTO';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  /* Cart items observable */
  private cartItems = new BehaviorSubject<ProductDTO[]>([]);
  cart$ = this.cartItems.asObservable();

  /* Current user email */
  private currentUserEmail: string | null = null;

  constructor() {}

  /* Switch user (load cart) */
  switchUser(email?: string) {
    this.currentUserEmail = email || localStorage.getItem('userEmail');
    if (this.currentUserEmail) {
      const savedCart = localStorage.getItem(`cart_${this.currentUserEmail}`);
      this.cartItems.next(savedCart ? JSON.parse(savedCart) : []);
    } else {
      this.cartItems.next([]);
    }
  }

  /* Add product to cart */
  addToCartnew(product: ProductDTO) {
    const items = [...this.cartItems.value];
    const index = items.findIndex(i => i.id === product.id);
    if (index > -1) {
      items[index].quantity! += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }
    this.cartItems.next(items);
    this.saveCart(); // Save changes
  }

  /* Remove product from cart */
  removeFromCart(productId: number) {
    const items = this.cartItems.value.filter(i => i.id !== productId);
    this.cartItems.next(items);
    this.saveCart();
  }

  /* Clear cart */
  clearCart() {
    this.cartItems.next([]);
    this.saveCart();
  }

  /* Get total amount */
  getTotal(): number {
    return this.cartItems.value.reduce(
      (sum, item) => sum + (item.price * (item.quantity || 1)),
      0
    );
  }

  /* Save cart to localStorage */
  private saveCart() {
    if (this.currentUserEmail) {
      localStorage.setItem(`cart_${this.currentUserEmail}`, JSON.stringify(this.cartItems.value));
    }
  }
}
