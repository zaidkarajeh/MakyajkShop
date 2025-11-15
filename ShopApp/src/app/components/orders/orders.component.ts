import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  /* Orders array */
  orders: any[] = []; // Currently empty

  /* Constructor */
  constructor(private router: Router) {}

  /* Initialize component */
  ngOnInit(): void {
    // Temporarily no orders; later fetch from localStorage or API
  }

  /* Navigate to products page */
  goShopping() {
    this.router.navigate(['/products']);
  }

  /* View order details */
  viewOrder(id: number) {
    alert('This feature is coming soon!');
  }
}
