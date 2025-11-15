import { Component, OnInit } from '@angular/core';
import { ProductDTO } from 'src/app/model/ProductDTO';
import { ProductService } from 'src/app/Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {

  products: ProductDTO[] = [];            // ✅ All products in this category
  categoryName: string = '';              // ✅ Current category
  visibleProducts = 6;                    // ✅ Initial visible products
  hoverSpeed = 500;                       // ✅ Hover image speed
  currentImages: { [productId: number]: string } = {}; // ✅ Current displayed image for each product
  hoverIntervals: { [productId: number]: any } = {};   // ✅ Hover intervals
  private shuffleInterval: any;          // ✅ Periodic shuffle interval

  categories: string[] = ['Hair care','Body care','Skin care','Nail care','Cosmetics']; // ✅ All categories

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router,
              private cartService: CartService)  {}

  ngOnInit(): void {
    // ✅ Load category from URL and products
    this.categoryName = this.route.snapshot.paramMap.get('categoryName') || '';
    this.loadProducts(this.categoryName);

    // ✅ Shuffle products every 10 seconds
    this.shuffleInterval = setInterval(() => {
      this.products = this.shuffleArray(this.products);
    }, 10000);
  }

  // ✅ Load products by category
  loadProducts(category: string) {
    this.productService.getProductsByCategory(category).subscribe({
      next: (data: ProductDTO[]) => {
        this.products = data.map(p => {
          if (!p.imageUrls) p.imageUrls = [];

          // ✅ Set initial image
          if (p.imageUrls.length > 0) {
            this.currentImages[p.id] = p.imageUrls[0];
          } else {
            this.currentImages[p.id] = 'assets/images/no-image.png';
          }

          return p;
        });

        console.log('Products loaded for category', category, this.products);
      },
      error: err => console.error(err)
    });
  }

  // ✅ Switch category
  goToCategory(category: string) {
    this.categoryName = category;
    this.loadProducts(category);
  }

  // ✅ Add product to cart
  addToCartnew(product: ProductDTO) {
    this.cartService.addToCartnew(product);
    console.log('Added to cart:', product);
  }

  // ✅ Start image hover slideshow
  startHover(product: ProductDTO) {
    if (!product.imageUrls || product.imageUrls.length < 2) return;

    let index = 0;
    this.hoverIntervals[product.id] = setInterval(() => {
      index = (index + 1) % product.imageUrls.length;
      this.currentImages[product.id] = product.imageUrls[index];
    }, this.hoverSpeed);
  }

  // ✅ Stop hover slideshow
  stopHover(product: ProductDTO) {
    clearInterval(this.hoverIntervals[product.id]);
    this.currentImages[product.id] = product.imageUrls[0] || 'assets/images/no-image.png';
  }

  // ✅ Navigate to product details
  goToDetails(productId: number) {
    this.router.navigate(['/product-details', productId]);
  }

  // ✅ Shuffle array randomly
  shuffleArray(array: any[]): any[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}