import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {

  base64Image!: string;
  constructor(private router: Router) { }
  ngOnInit(): void {
  }
navigateToIncentivePlans() {
  this.router.navigate(['/promotion-list']);
}
navigateToIncomes() {
  this.router.navigate(['/receipt-list']);
}
navigateToAndroid() {
 fetch('assets/image.png')
 .then(response => response.blob())
 .then(blob => {
   let reader = new FileReader();
   reader.onloadend = () => {
     if (typeof reader.result === 'string') {
       this.base64Image = reader.result;

       const customUrl = 'your-app://print?image=' + encodeURIComponent(this.base64Image);
       window.location.href = customUrl;

     } else {
       console.error('Failed to read the image file.');
     }
   };
   reader.readAsDataURL(blob);
 });
}
navigateToBanks() {
  this.router.navigate(['/bank-list']);
}
navigateToGoods() {
  // this.router.navigate(['/product-list']);
  this.router.navigate(['/product']);
}
navigateToPeople() {
  this.router.navigate(['/people-list']);
}

}
