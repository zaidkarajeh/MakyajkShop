import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CartService } from 'src/app/Services/cart.service';
import { ProductDTO } from 'src/app/model/ProductDTO';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  // ======= Product Data =======
  product: ProductDTO | null = null;
  currentImage: string = '';
  fallbackImage: string = 'https://localhost:44333/images/no-image.png';
  activeSlideIndex = 0;
  expanded = false;

  // ======= Countdown Timer =======
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  private countdownInterval: any;

  // ======= Cart and Quantity =======
  cartItems: ProductDTO[] = [];
  total = 0;
  quantity: number = 1;

  private routeSubscription: any; // <-- Add this to unsubscribe

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Subscribe to route params to react to product ID changes
    this.routeSubscription = this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.loadProduct(id);
        this.startCountdown(1 * 60 * 60); // restart 1-hour countdown for new product
      }
    });
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  // ================== Load Product ==================
  private loadProduct(id: number) {
  // Scroll to top when loading new product
  window.scrollTo({ top: 0, behavior: 'smooth' });

  this.productService.getProduct(id).subscribe({
    next: (data) => {
      this.product = data;

      // Reset image slider
      this.activeSlideIndex = 0;

      // Set current image
      if (!this.product.imageUrls || this.product.imageUrls.length === 0) {
        this.currentImage = this.fallbackImage;
        this.product.imageUrls = [this.fallbackImage];
      } else {
        this.currentImage = this.buildImageUrl(this.product.imageUrls[0]);
      }
    },
    error: () => {
      this.product = null;
      this.currentImage = this.fallbackImage;
    }
  });
}


  private buildImageUrl(img: string): string {
    return img.startsWith('http') ? img : `https://localhost:44333/images/${img}`;
  }

  // ================== Image Slider ==================
  changeImage(img: string): void {
    this.currentImage = this.buildImageUrl(img);
  }

  setActiveSlide(index: number): void {
    this.activeSlideIndex = index;
  }

  nextSlide(): void {
    if (this.product?.imageUrls?.length) {
      this.activeSlideIndex = (this.activeSlideIndex + 1) % this.product.imageUrls.length;
    }
  }

  prevSlide(): void {
    if (this.product?.imageUrls?.length) {
      this.activeSlideIndex = (this.activeSlideIndex - 1 + this.product.imageUrls.length) % this.product.imageUrls.length;
    }
  }

  toggleText(): void {
    this.expanded = !this.expanded;
  }

  // ================== Countdown Timer ==================
  startCountdown(durationInSeconds: number): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    let timeLeft = durationInSeconds;

    this.countdownInterval = setInterval(() => {
      this.hours = Math.floor(timeLeft / 3600);
      this.minutes = Math.floor((timeLeft % 3600) / 60);
      this.seconds = timeLeft % 60;

      if (timeLeft <= 0) {
        clearInterval(this.countdownInterval);
        this.hours = this.minutes = this.seconds = 0;
      }

      timeLeft--;
    }, 1000);
  }

  // ================== Cart Actions ==================
  addToCartnew(product: ProductDTO): void {
    this.cartService.addToCartnew(product);
    console.log('Added to cart:', product);
  }

  removeItem(id: number): void {
    this.cartService.removeFromCart(id);
  }

  // ================== Quantity ==================
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }

  // ================== Total Calculation ==================
  updateTotal(): void {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }
}
