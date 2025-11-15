import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})


export class ContactComponent implements OnInit {
  showMainContainer: boolean = true; // نخفي Main Container هنا
 constructor (
    private router: Router
  ){}
    ngOnInit(): void {
      
     // تحقق من URL الحالي عند تحميل الصفحة مباشرة
    this.showMainContainer = this.router.url !== '/cart-page';

    // استمع لتغيرات الروتر لاحقًا
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMainContainer = event.urlAfterRedirects !== '/cart-page';
      }
    });
  }
 

}
