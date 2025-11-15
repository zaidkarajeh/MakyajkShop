import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDTO } from 'src/app/model/ProductDTO';
import { ProductService } from 'src/app/Services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.css']
})
export class AdminProductListComponent implements OnInit {

  /* Product lists */
  ProductList: ProductDTO[] = [];
  filteredProducts: ProductDTO[] = [];
  searchText: string = '';

  /* Categories */
  categories: string[] = ['Hair care','Body care','Skin care','Nail care','Cosmetics'];
  selectedCategory: string = '';

  /* Constructor with dependencies */
  constructor(private productService: ProductService, private router: Router) {}

  /* Initialize component */
  ngOnInit(): void {
    this.fillProduct();
  }

  /* Fetch products */
  fillProduct() {
    this.productService.getProducts().subscribe({
      next: data => {
        this.ProductList = data.map(p => {
          if (!p.imageUrls) p.imageUrls = [];
          if (!p.price) p.price = 0;
          return p;
        });
        this.filteredProducts = [...this.ProductList];
      },
      error: () => console.log("error")
    });
  }

  /* Delete product */
  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire({
              title: "Deleted!",
              text: "Your product has been deleted.",
              icon: "success"
            });
            this.fillProduct();
          },
          error: () => {
            Swal.fire({
              title: "Error",
              text: "Deletion failed, please try again",
              icon: "error"
            });
          }
        });
      }
    });
  }

  /* Navigate to edit product */
  editProduct(id: number) {
    this.router.navigate(['/add-product', id]);
  }

  /* Search products */
  onSearch() {
    this.applyFilters();
  }

  /* Filter by category */
  filterByCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  /* Apply search and category filters */
  applyFilters() {
    let temp = [...this.ProductList];

    /* Filter by search text */
    if (this.searchText.trim()) {
      const text = this.searchText.toLowerCase();
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(text) ||
        p.description.toLowerCase().includes(text) ||
        p.category.toLowerCase().includes(text)
      );
    }

    /* Filter by category */
    if (this.selectedCategory) {
      temp = temp.filter(p => p.category === this.selectedCategory);
    }

    this.filteredProducts = temp;
  }
}
