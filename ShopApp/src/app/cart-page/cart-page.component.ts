import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';
import { ProductDTO } from 'src/app/model/ProductDTO';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  // Items currently in the cart
  cartItems: ProductDTO[] = [];

  // Total cart value
  total = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });

    
  }

  // Remove an item from the cart
  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.updateTotal();
  }

  // Clear all items from the cart
  clearCart() {
    this.cartService.clearCart();
    this.updateTotal();
  }

  // Navigate to product details page
  goToDetails(productId: number) {
    this.router.navigate(['/product-details', productId]);
  }

  // Decrease quantity of a product in cart
  decreaseQuantity(item: any) {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
    } else {
      // If quantity reaches 0, remove item
      this.removeItem(item.id);
    }
    this.updateTotal();
  }

  // Increase quantity of a product in cart
  increaseQuantity(item: any) {
    item.quantity = item.quantity ? item.quantity + 1 : 1;
    this.updateTotal();
  }

  // Recalculate total cart value
  updateTotal() {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }

  // Navigate to home page
  goHome() {
    this.router.navigate(['']);
  }
}
