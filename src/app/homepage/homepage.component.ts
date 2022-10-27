import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Book } from '../books/book.model';
import { BooksService } from '../books/books.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  private booksSub: Subscription;

  constructor(
    public booksService: BooksService
  ) { }

  ngOnInit() {
    this.booksService.getBooks();
    this.booksSub = this.booksService
      .getBooksUpdateListener()
      .subscribe ((bookData: Book []) => {
        this.books = bookData;
      })
  }

  ngOnDestroy () {
    this.booksSub.unsubscribe();
  }
}
