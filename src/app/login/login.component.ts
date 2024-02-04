import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formData: { username: string, password: string } = { username: '', password: '' };
  loginError: string = '';
  isLoading: boolean = false;

  constructor(private loginService: LoginService, private router:Router) {}

  onSubmit() {
    const { username, password } = this.formData;

    this.isLoading = true; // Show loading indicator
    this.loginError = ''; // Clear any previous error message

    this.loginService.login(username, password).subscribe({
      next: (response) => {
        // Handle successful response here
        console.log(response);
        this.isLoading = false; // Hide loading indicator on success
        this.router.navigateByUrl('user-information'); // Navigate on successfu
      },
      error: (error) => {
        // Handle error, e.g., display an error message
        this.loginError = 'Login failed. Please check your credentials.';
        this.isLoading = false; // Hide loading indicator on error
      }
    });    
  }
}
