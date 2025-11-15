import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { AdminProductListComponent } from './admin/admin-product-list/admin-product-list.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { MenuPageComponent } from './components/menu-page/menu-page.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ContactComponent } from './components/contact/contact.component';
import { CreateAccountComponent } from './admin/create-account/create-account.component';
import { AddRoleComponent } from './admin/add-role/add-role.component';
import { LoginComponent } from './admin/login/login.component';
import { adminGuard } from './guards/admin.guard'; // عدل المسار حسب مكان الملف
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  { path:'',component:DashboardComponent},
  {path :'MenuPage',component:MenuPageComponent},
  { path: 'products', component:ProductListComponent },
 { path: 'admin/addproduct', component: AddProductComponent, canActivate: [adminGuard] },
{ path: 'admin/listproducts', component: AdminProductListComponent, canActivate: [adminGuard] },
{ path: 'admin/addrole', component: AddRoleComponent, canActivate: [adminGuard] },

  { path: 'add-product/:id', component: AddProductComponent },
  { path: 'cart-page', component: CartPageComponent },
  { path: 'Home',component:HomeComponent},
  { path :'Categories',component:CategoriesComponent},
  { path: 'category/:categoryName', component: CategoryPageComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  {path: 'contact',component:ContactComponent},
  {path: 'login',component:LoginComponent},
  { path:'CreateAccount',component:CreateAccountComponent },
  {path:'orders-page',component:OrdersComponent}

  
 
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
