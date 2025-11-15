import { Component, OnInit, HostListener } from '@angular/core';
import { ProductDTO } from 'src/app/model/ProductDTO';
import { CartService } from 'src/app/Services/cart.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit {

  // Cart toggle and items
  showCart = false; // Controls whether the cart sidebar/popup is visible
  cartItems: ProductDTO[] = []; // Stores the products currently in the cart
  total = 0; // Total price of all items in the cart
  faTrash = faTrash; // FontAwesome trash icon for removing items
  dropdownOpen = false; // Dropdown menu visibility for account actions
  isLoggedIn = false; // Boolean to track if the user is logged in

  // Search and category
  searchText: string = ''; // Current search input from user
  category: string = ''; // Currently selected product category

  // Products list
  products: ProductDTO[] = []; // List of all products to display

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkLoginStatus(); // Check if the user is logged in on component init
    this.loadProducts(); // Load all products from backend

    // Subscribe to cart changes and update cart items & total
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  // Load products from backend based on search text and category
  loadProducts() {
    this.productService.getProducts(this.searchText, this.category)
      .subscribe(res => this.products = res);
  }

  // Toggle cart sidebar visibility
 openCart() {
  this.showCart = true;
}

closeCart() {
  this.showCart = false;
}

  // Remove single item from cart
  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  // Clear all items from the cart
  clearCart() {
    this.cartService.clearCart();
  }

  // Get total count of items in the cart
  getCartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  // Smooth scroll to a specific section of the page
  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      const yOffset = -100; // Offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // Close navbar menu if open (for mobile)
    const navBar = document.getElementById('navbarTogglerDemo02');
    if (navBar && navBar.classList.contains('show')) {
      navBar.classList.remove('show');
    }
  }

  // Navigate to product details page
  goToDetails(productId: number) {
    this.router.navigate(['/product-details', productId]);
  }

  // Increase product quantity in cart
  increaseQuantity(item: any) {
    item.quantity = item.quantity ? item.quantity + 1 : 1;
    this.updateTotal();
  }

  // Decrease product quantity in cart or remove if quantity is 1
  decreaseQuantity(item: any) {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item.id);
    }
    this.updateTotal();
  }

  // Update total price in the cart
  updateTotal() {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }

  // Navigate to cart page
  goToInfoCart() {
    this.router.navigate(['/cart-page']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Perform search for products
  onSearch() {
    this.router.navigate(['/products'], { queryParams: { search: this.searchText } });
  }

  // Navigate to a category page
  goToCategory(category: string) {
    this.router.navigate(['/category', category]);
  }

  // Navigate to homepage
  goHome() {
    this.router.navigate(['']);
  }

  // Navigate to Products page
  goProducts() {
    this.router.navigate(['/products']);
  }

  // Smooth scroll to a section by its ID
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

 

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.account-menu')) {
      this.dropdownOpen = false;
    }
  }

  // Navigate to login page
  goLogin() {
    this.router.navigate(['/login']);
  }

  // Logout user and redirect
  logout() {
    localStorage.removeItem('APIToken');
    localStorage.removeItem('userEmail');
    this.dropdownOpen = false;
    this.isLoggedIn = false;
    this.cartService.switchUser(); // يفرغ السلة الحالية فقط

    // Redirect to homepage/dashboard
    this.router.navigate(['']); 
  }

  // Check login status from local storage
  checkLoginStatus() {
    const token = localStorage.getItem('APIToken');
    this.isLoggedIn = !!token;
  }

  // Navigate to add role page (Admin only)
  goAddRoles() {
    this.router.navigate(['/admin/addrole']);
  }

  // Navigate to add product page (Admin only)
  goAddProduct() {
    this.router.navigate(['/admin/addproduct']);
  }

  // Navigate to list products page (Admin only)
  goListProduct() {
    this.router.navigate(['/admin/listproducts']);
  }

  // Check if user is logged in (for menu visibility)
  menuIsLoggedIn() {
    return !!localStorage.getItem('userEmail');
  }

  // Check if user is admin (for menu visibility)
  menuIsAdmin() {
    return localStorage.getItem('userEmail') === 'zaid@gmail.com';
  }
 // Navigate to orders page
  goOrders() {
    this.router.navigate(['/orders-page']);
  }
openDropdown() {
  this.dropdownOpen = true;
}

closeDropdown() {
  this.dropdownOpen = false;
}

}
