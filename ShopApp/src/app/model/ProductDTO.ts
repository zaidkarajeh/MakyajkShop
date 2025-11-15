export class ProductDTO{
   id!: number;
  name!: string;
  description!: string;
  price!: number;
  category!: string;
  stock!: number;
  quantity?: number; 
  
  imageUrls: string[] = [];

}