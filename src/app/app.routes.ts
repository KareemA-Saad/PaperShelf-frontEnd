import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { RegisterFormComponent } from './auth/register-form/register-form.component';
import { ForgotPasswordFormComponent } from './auth/forgot-password-form/forgot-password-form.component';
import { OtpFormComponent } from './auth/otp-form/otp-form.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { MainShopComponent } from './shop/main-shop/main-shop.component';
import { BookCatalogComponent } from './pages/book-catalog.component';
import { BookSliderComponent } from './components/book-slider/book-slider.component';


export const routes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginFormComponent },
            { path: 'register', component: RegisterFormComponent },
            { path: 'forgot', component: ForgotPasswordFormComponent },
            { path: 'otp', component: OtpFormComponent },
            { path: 'verify', component: VerifyComponent },
            { path: '**', redirectTo: 'login', pathMatch: 'full' }
      

        ]
    },
    { path: 'shop', component: MainShopComponent },

    {
    path: 'shopp',
    loadComponent: () =>
      import('./pages/book-catalog.component').then(m => m.BookCatalogComponent)
  },
 {
    path: 'slider',
    component: BookSliderComponent,
  },

    { path: "**", redirectTo: '/auth', pathMatch: 'full' }
];
