import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // HTTP client
import { Observable } from 'rxjs';
import { ProductDTO } from '../model/ProductDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  /* API URL */
  private apiUrl = 'https://localhost:44333/api/Product';

  constructor(private http: HttpClient) { }

  /* Get products (optional search/category) */
  getProducts(search?: string, category?: string): Observable<ProductDTO[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);

    return this.http.get<ProductDTO[]>(this.apiUrl, { params });
  }

  /* Get products by category */
  getProductsByCategory(category: string): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.apiUrl}?category=${category}`);
  }

  /* Get single product */
  getProduct(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/${id}`);
  }

  /* Insert new product */
  InsertProduct(product: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(this.apiUrl, product);
  }

  /* Update product */
  updateProduct(id: number, product: ProductDTO) {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  /* Delete product */
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /* Upload product images */
  uploadImages(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file, file.name));
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

}
