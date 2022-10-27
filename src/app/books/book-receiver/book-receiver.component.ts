import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Book } from '../book.model';
import { BooksService } from '../books.service';
import { AuthService } from "../../auth/auth.service";

@Component ({
    selector: 'app-book-receiver',
    templateUrl: './book-receiver.component.html',
    styleUrls: ['./book-receiver.component.css']
})

export class BookReceiverComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private booksSub: Subscription;
  private authStatusSub: Subscription;

  constructor (
    public booksService: BooksService,
    private authService: AuthService
  ) {}

  ngOnInit () {
    this.isLoading = true;
    this.booksService.getBooks();
    this.userId = this.authService.getUserId ();
    this.booksSub = this.booksService
      .getBooksUpdateListener()
      .subscribe ((bookData: Book []) => {
          this.isLoading = false;
          this.books = bookData;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();// from the auht.service
    this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId ();
          });
  }

  ngOnDestroy () {
    this.booksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

