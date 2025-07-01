import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { RegisterFormComponent } from './auth/register-form/register-form.component';
import { ForgotPasswordFormComponent } from './auth/forgot-password-form/forgot-password-form.component';
import { OtpFormComponent } from './auth/otp-form/otp-form.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { MainShopComponent } from './shop/main-shop/main-shop.component';
import { BookCatalogComponent } from './pages/book-catalog.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { HomeComponent } from './home/home.component';
import { roleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';

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
      { path: 'verify', component: VerifyComponent }
    ],
  },
  { path: 'shop', component: MainShopComponent , canActivate:[AuthGuard]},
  { path: 'wishlist', component: WishlistComponent , canActivate:[AuthGuard]},
  { path: 'home', component: HomeComponent , canActivate:[AuthGuard]},
  { path: "**", component: NotfoundComponent , canActivate:[AuthGuard]}
]
