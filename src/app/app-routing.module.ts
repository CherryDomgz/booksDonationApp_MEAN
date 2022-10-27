import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { Homepage2Component } from './homepage2/homepage2.component';
import { BookDonationComponent } from './books/book-donation/book-donation.component';
import { BookReceiverComponent } from './books/book-receiver/book-receiver.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookEditComponent } from './books/book-edit/book-edit.component';
import { BookCheckoutComponent } from './books/book-checkout/book-checkout.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'Home', component: Homepage2Component, canActivate: [AuthGuard] },
  { path: 'Donate', component: BookDonationComponent, canActivate: [AuthGuard]  },
  { path: 'edit/:bookId', component: BookEditComponent, canActivate: [AuthGuard]  },
  { path: 'Catalog', component: BookListComponent, canActivate: [AuthGuard]  },
  { path: 'Receive', component: BookReceiverComponent, canActivate: [AuthGuard]  },
  { path: 'checkout/:bookId', component: BookCheckoutComponent, canActivate: [AuthGuard]  },
  { path: 'Login', component: LoginComponent },
  { path: 'Signup', component: SignupComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
