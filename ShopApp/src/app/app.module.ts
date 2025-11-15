import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './components/product-list/product-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminProductListComponent } from './admin/admin-product-list/admin-product-list.component';
import { FormsModule  } from '@angular/forms';
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
import { OrdersComponent } from './components/orders/orders.component';



@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    DashboardComponent,
    AddProductComponent,
    AdminProductListComponent,
    CartPageComponent,
    HomeComponent,
    CategoriesComponent,
    CategoryPageComponent,
    MenuPageComponent,
    ProductDetailsComponent,
    ContactComponent,
    CreateAccountComponent,
    AddRoleComponent,
    LoginComponent,
    OrdersComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
