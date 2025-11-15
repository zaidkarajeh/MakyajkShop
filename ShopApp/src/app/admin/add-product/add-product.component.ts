import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductDTO } from 'src/app/model/ProductDTO';
import { ProductService } from 'src/app/Services/product.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  productForm!: FormGroup;
  selectedFiles: File[] = [];
  selectedFileNames: string[] = [];
  oldImages: string[] = [];
  isEditMode: boolean = false;
  productId!: number;

  categories: string[] = ['Hair care','Body care','Skin care','Nail care','Cosmetics'];

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private route: ActivatedRoute
            ) {}

  ngOnInit(): void {
    this.BuildForm();
    this.loadRouteInfo();
  }

  // Build reactive form
  BuildForm() {
    this.productForm = this.formBuilder.group({
      txtname: ['', Validators.required],
      txtdescription: ['', Validators.required],
      txtprice: ['', Validators.required],
      txtcategory: ['', Validators.required],
      txtstock: ['', Validators.required],
    });
  }

  // Handle file selection for new images
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFiles = Array.from(input.files);
    this.selectedFileNames = this.selectedFiles.map(f => f.name);
  }

  // Save new product
  Save() {
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const newProduct = new ProductDTO();
    newProduct.name = this.productForm.value['txtname'];
    newProduct.description = this.productForm.value['txtdescription'];
    newProduct.price = parseFloat(this.productForm.value['txtprice']);
    newProduct.category = this.productForm.value['txtcategory'];
    newProduct.stock = this.productForm.value['txtstock'];
    newProduct.imageUrls = [];

    const saveProduct = () => {
      this.productService.InsertProduct(newProduct).subscribe({
        next: () => {
          Swal.fire({
            title: "Saved successfully",
            icon: "success",
            draggable: true
          });
          this.productForm.reset();
          this.selectedFiles = [];
          this.selectedFileNames = [];
        },
        error: () => {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
            draggable: true
          });
        }
      });
    };

    if (this.selectedFiles.length > 0) {
      this.productService.uploadImages(this.selectedFiles).subscribe({
        next: (res: any) => {
          // backend returns array of filenames
          newProduct.imageUrls = res.fileNames || [];
          saveProduct();
        },
        error: (err) => {
          console.error('Error uploading images', err);
          Swal.fire({
            title: "Error uploading images",
            icon: "error",
            draggable: true
          });
        }
      });
    } else {
      saveProduct();
    }
  }

  // Load product data by id (for edit mode)
  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.productForm.patchValue({
          txtname: data.name,
          txtdescription: data.description,
          txtprice: data.price,
          txtcategory: data.category,
          txtstock: data.stock
        });

        // Store only filenames of existing images
        this.oldImages = data.imageUrls.map((img: string) => {
          return img.includes('/') ? img.split('/').pop()! : img;
        });
      },
      error: () => console.log('Error loading product')
    });
  }

  // Check route to detect edit mode
  loadRouteInfo(){
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = +idParam;
      this.loadProduct(this.productId);
    }
  }

  // Update existing product
  Update() {
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const updatedProduct = new ProductDTO();
    updatedProduct.id = this.productId;
    updatedProduct.name = this.productForm.value['txtname'];
    updatedProduct.description = this.productForm.value['txtdescription'];
    updatedProduct.price = parseFloat(this.productForm.value['txtprice']);
    updatedProduct.category = this.productForm.value['txtcategory'];
    updatedProduct.stock = this.productForm.value['txtstock'];
    updatedProduct.imageUrls = [...this.oldImages];

    // If there are new files, upload first
    if (this.selectedFiles.length > 0) {
      this.productService.uploadImages(this.selectedFiles).subscribe({
        next: (res: any) => {
          updatedProduct.imageUrls.push(...res.fileNames);

          this.productService.updateProduct(this.productId, updatedProduct).subscribe({
            next: () => {
              Swal.fire({
                title: "Updated successfully with images",
                icon: "success",
                draggable: true
              });
              this.productForm.reset();
              this.selectedFiles = [];
              this.selectedFileNames = [];
              this.oldImages = [];
            },
            error: () => {
              Swal.fire({
                title: "Error updating product",
                icon: "error",
                draggable: true
              });
            }
          });
        },
        error: () => {
          Swal.fire({
            title: "Error uploading images",
            icon: "error",
            draggable: true
          });
        }
      });
    } else {
      // If no new images, just update product
      this.productService.updateProduct(this.productId, updatedProduct).subscribe({
        next: () => {
          Swal.fire({
            title: "Updated successfully",
            icon: "success",
            draggable: true
          });
          this.productForm.reset();
        },
        error: () => {
          Swal.fire({
            title: "Error updating product",
            icon: "error",
            draggable: true
          });
        }
      });
    }
  }

  // Preview new images before upload
  filePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  // Remove old image
  removeOldImage(index: number) {
    this.oldImages.splice(index, 1);
  }

  // Remove newly selected image
  removeNewFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  // Update only images of the product
  updateImagesOnly() {
    const updatedProduct = new ProductDTO();
    updatedProduct.id = this.productId;
    updatedProduct.imageUrls = [...this.oldImages];

    if (this.selectedFiles.length > 0) {
      this.productService.uploadImages(this.selectedFiles).subscribe({
        next: (res: any) => {
          updatedProduct.imageUrls.push(...res.fileNames);

          this.productService.updateProduct(this.productId, updatedProduct).subscribe({
            next: () => Swal.fire({ title: "Images updated successfully", icon: "success" }),
            error: () => Swal.fire({ title: "Error updating images", icon: "error" })
          });
        },
        error: () => Swal.fire({ title: "Error uploading new images", icon: "error" })
      });
    } else {
      this.productService.updateProduct(this.productId, updatedProduct).subscribe({
        next: () => Swal.fire({ title: "Images updated successfully", icon: "success" }),
        error: () => Swal.fire({ title: "Error updating images", icon: "error" })
      });
    }
  }
}
