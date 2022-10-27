import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";


import { BooksService } from '../books.service';
import { Book } from '../book.model';
import { AuthService } from "../../auth/auth.service";

@Component ({
  selector: 'app-book-checkout',
  templateUrl: './book-checkout.component.html',
  styleUrls: ['./book-checkout.component.css']
})

export class BookCheckoutComponent implements OnInit, OnDestroy {
  books: Book [];
  book: Book;
  isLoading = false;
  private mode = "Receive";
  private bookId: string;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  private booksSub: Subscription;

  constructor(
    public booksService: BooksService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("bookId")) {
        this.mode = "checkout";
        this.bookId = paramMap.get("bookId");
        this.isLoading = true;
        this.booksService
          .getBook(this.bookId)
          .subscribe(bookData => {
             this.isLoading = false;
             this.book = {
              id: bookData._id,
              title: bookData.title,
              isbn: bookData.isbn,
              publicationDate: bookData.publicationDate,
              author: bookData.author,
              publications: bookData.publications,
              imagePath: bookData.imagePath,
              creator: bookData.creator
            };
          })
        } else {
          this.mode = "Receive";
          this.bookId = null;
      }
    });

    //this.isLoading = true;
    //this.booksService.getBook(this.bookId);
    //this.booksSub = this.booksService
      //.getBooksUpdateListener()
      //.subscribe ((bookData: Book []) => {
          //this.isLoading = false;
          //this.books = bookData;
      //});

    this.userIsAuthenticated = this.authService.getIsAuth();// from the auht.service
    this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
          });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}


