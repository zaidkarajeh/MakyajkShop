import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CartService } from 'src/app/Services/cart.service';
import { ProductDTO } from 'src/app/model/ProductDTO';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {

  // ======= Product Data =======
  products: ProductDTO[] = [];                   // Stores the list of products
  currentImages: { [productId: number]: string } = {}; // Tracks current image for each product
  hoverIntervals: { [productId: number]: any } = {};   // Stores interval IDs for image rotation on hover
  searchText: string = '';                        // Current search term from query params
  noProducts: boolean = false;                   // Flag if no products are found

  // ======= Display Controls =======
  visibleProducts = 12;     // Number of products shown initially
  loadCount = 12;           // Number of products to load per "Show More"
  showHeaders = true;       // Show page headers
  showMorebtn = true;       // Show "Show More" button
  showMakeupHeader = false; // Show "You Might Like" header
  hoverSpeed = 500;         // Image rotation speed on hover (ms)
  successMessage: string = ''; // Feedback message when adding to cart

  private shuffleInterval: any; // Interval for shuffling products every 10 seconds

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // ================== Lifecycle Hooks ==================
  ngOnInit(): void {
    // Load all products on initialization
    this.loadProducts();

    // Listen for changes in query parameters (e.g., search)
    this.route.queryParams.subscribe(params => {
      this.searchText = params['search'] || '';
      this.loadProducts(); // Reload products if search term changes
    });

    // Listen to router events to update UI based on current page
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateShowButton(event.urlAfterRedirects);
      }
    });

    // Initial setup for display
    this.updateShowButton(this.router.url);

    // Shuffle products every 10 seconds
    this.shuffleInterval = setInterval(() => {
      this.products = this.shuffleArray(this.products);
    }, 10000);
  }

  ngOnDestroy(): void {
    // Clear shuffle interval when leaving component
    if (this.shuffleInterval) clearInterval(this.shuffleInterval);
  }

  // ================== Load Products from Service ==================
  loadProducts(): void {
    this.productService.getProducts(this.searchText).subscribe({
      next: (data: ProductDTO[]) => {
        // Prepare products and set default image
        this.products = data.map(p => {
          if (!p.imageUrls) p.imageUrls = [];
          if (p.imageUrls.length > 0) this.currentImages[p.id] = p.imageUrls[0];
          return p;
        });

        // Shuffle products randomly
        this.products = this.shuffleArray(this.products);

        // Update UI controls based on current page
        this.updateShowButton(this.router.url);

        // Set flag if no products
        this.noProducts = this.products.length === 0;
      },
      error: (err) => console.error('Error loading products:', err),
    });
  }

  // ================== Hover Image Rotation ==================
  startHover(product: ProductDTO): void {
    if (!product.imageUrls || product.imageUrls.length < 2) return;
    let index = 0;

    // Rotate images every `hoverSpeed` milliseconds
    this.hoverIntervals[product.id] = setInterval(() => {
      index = (index + 1) % product.imageUrls.length;
      this.currentImages[product.id] = product.imageUrls[index];
    }, this.hoverSpeed);
  }

  stopHover(product: ProductDTO): void {
    // Stop rotation and revert to first image
    clearInterval(this.hoverIntervals[product.id]);
    this.currentImages[product.id] = product.imageUrls[0] || 'assets/images/no-image.png';
  }

  // ================== Add Product to Cart ==================
  addToCartnew(product: ProductDTO): void {
    this.cartService.addToCartnew(product);
    this.successMessage = '✅ Product added to cart successfully!';

    // Clear message after 3 seconds
    setTimeout(() => (this.successMessage = ''), 3000);
  }

  // ================== Navigate to Product Details ==================
  goToDetails(productId: number): void {
    const currentUrl = this.router.url;

    // If we are already on the Product Details page, navigate using `navigateByUrl`
    // This forces the page to reload with the new product while staying on the same route
    if (currentUrl.includes('/product-details')) {
      this.router.navigateByUrl(`/product-details/${productId}`, { skipLocationChange: false });
    } else {
      // Otherwise navigate normally
      this.router.navigate(['/product-details', productId]);
    }
  }

  // ================== Other Navigation Helpers ==================
  goToProducts(): void {
    this.showHeaders = false;
    this.router.navigate(['/products']);
  }

  goHome(): void {
    this.router.navigate(['']);
  }

  // ================== Show More Products ==================
  showMore(): void {
    if (this.visibleProducts + this.loadCount <= this.products.length) {
      this.visibleProducts += this.loadCount;
    } else {
      this.visibleProducts = this.products.length;
      this.showMorebtn = false;
    }
  }

  // ================== Update UI Based on Page ==================
  updateShowButton(url: string) {
    if (url.includes('/dashboard')) {
      this.showMorebtn = true;
      this.showHeaders = true;
      this.visibleProducts = 6;
      this.showMakeupHeader = false;
    } else if (url.includes('/products')) {
      this.showMorebtn = false;
      this.showHeaders = false;
      this.visibleProducts = this.products.length;
      this.showMakeupHeader = false;
    } else if (url.includes('/cart-page') || url.includes('/product-details')) {
      this.showMorebtn = false;
      this.showHeaders = false;
      this.visibleProducts = this.products.length;
      this.showMakeupHeader = true; // Show "You Might Like to Fill it With" header
    } else {
      this.showMakeupHeader = false;
    }
  }

  // ================== Utility Function ==================
  shuffleArray(array: any[]): any[] {
    // Randomly shuffle an array
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}
