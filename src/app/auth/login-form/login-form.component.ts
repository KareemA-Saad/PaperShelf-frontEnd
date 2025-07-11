import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { CartService } from '../../services/cart.service'; // ← ضيف الاستيراد

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private rolrserv: RoleService,
    private cartService: CartService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = null;
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          // Check if user is verified
          if (response.data.user.isEmailVerified) {
            // User is verified - proceed with normal login
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            this.rolrserv.setUser({
              name: response.data.user.name,
              email: response.data.user.email,
              role: response.data.user.role,
              token: response.data.accessToken
            });

            this.cartService.refreshCart();

            const userRole = response.data.user.role;
            setTimeout(() => {
              if (userRole === 'admin') {
                window.location.href = '/dashboard';
              } else {
                this.router.navigateByUrl('/home');
              }
            }, 10);
          } else {
            // User is not verified - redirect to verify component
            this.authService.setUnverifiedUserData({
              email: response.data.user.email,
              name: response.data.user.name,
              role: response.data.user.role
            });

            // Redirect to verify component for email verification
            this.router.navigate(['/auth/verify']);
          }
        },
        error: (err: any) => {
          // Check if the error is due to unverified email
          if (err.error?.message?.includes('Email not verified')) {
            // Store user data and redirect to verify component
            this.authService.setUnverifiedUserData({
              email: email,
              name: '', // We don't have this from error response
              role: 'user' // Default role
            });

            // Redirect to verify component for email verification
            this.router.navigate(['/auth/verify']);
          } else {
            // Handle other login errors
            this.errorMessage = err.error?.message || 'Login failed. Please try again.';
          }
        }
      });
    } else {
      this.errorMessage = 'Please correct the highlighted errors to proceed.';
    }
  }
}
