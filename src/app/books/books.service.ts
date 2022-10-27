import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";

import { Book } from './book.model';

@Injectable ({providedIn: 'root'})
export class BooksService {
  private books: Book [] = [];
  private booksUpdated = new Subject <Book[]>();

  constructor (private http: HttpClient, private router: Router) {}

  getBooks() {
    this.http
      .get<{message: string, books: any}>(
        'http://localhost:3000/api/books'
      )

      .pipe(map((bookData) => {// pipe is a method that accepts multiple operators we can add
        return bookData.books.map(book => {
          return {
            title: book.title,
            isbn: book.isbn,
            publicationDate: book.publicationDate,
            author: book.author,
            publications: book.publications,
            id: book._id, //_id in the backend - in the mongodb
            imagePath: book.imagePath,
            creator: book.creator
          };
        });
      }))

      .subscribe((transformedBooks) => {
        console.log (transformedBooks);
        this.books = transformedBooks;
        this.booksUpdated.next([...this.books]);
      });
  }

  getBooksUpdateListener () {
    return this.booksUpdated.asObservable();
  }

  getBook(id: string) {
    return this.http.get<{
       _id: string;
       title: string;
       isbn: string,
       publicationDate: string,
       author: string,
       publications: string,
       imagePath: string,
       creator: string;
      }>(
      "http://localhost:3000/api/books/" + id
      );
  }

  addBook (
    title: string,
    isbn: string,
    publicationDate: string,
    author: string,
    publications: string,
    image: File
    ) {

    const bookData = new FormData();
      bookData.append("title", title);
      bookData.append("isbn", isbn);
      bookData.append("publicationDate", publicationDate);
      bookData.append("author", author);
      bookData.append("publications", publications);
      bookData.append("image", image, title);

    //const book: Book = {
      //id: null,
      //title: title,
      //isbn: isbn,
      //publicationDate: publicationDate,
      //author: author,
      //publications: publications
    //};

    this.http
      .post <{message: string, book: Book}>(
        'http://localhost:3000/api/books', bookData
        )

      .subscribe ((responseData) => {
        console.log  (responseData.message);
        //const book: Book = {
        //id: responseData.book.id,
        //title: title,
        //isbn: isbn,
        //publicationDate: publicationDate,
        //author: author,
        //publications: publications,
        //imagePath: responseData.book.imagePath
      //}
        //this.books.push(book);
        //this.booksUpdated.next([...this.books]);
        this.router.navigate(["/Catalog"]);
      });
  }

  updateBook (
    id: string,
    title: string,
    isbn: string,
    publicationDate: string,
    author: string,
    publications: string,
    image: File | string
  ) {

  let bookData: Book | FormData;
    if (typeof image === "object") {
      bookData = new FormData ();
      bookData.append("id", id);
      bookData.append("title", title);
      bookData.append("isbn", isbn);
      bookData.append("publicationDate", publicationDate);
      bookData.append("author", author);
      bookData.append("publications", publications);
      bookData.append("image", image, title);
    } else {
      bookData = {
        id: id,
        title: title,
        isbn: isbn,
        publicationDate: publicationDate,
        author: author,
        publications: publications,
        imagePath: image,
        creator: null
      }
    };

    this.http
      .put("http://localhost:3000/api/books/" + id, bookData)
      .subscribe(response => {
        console.log (response);
        //const updatedBooks = [...this.books];
        //const oldBookIndex = updatedBooks.findIndex(p => p.id === id);
        //const book: Book = {
         // id: id,
          //title: title,
          //isbn: isbn,
          //publicationDate: publicationDate,
          //author: author,
          //publications: publications,
          //imagePath: ""
        //}
       // updatedBooks[oldBookIndex] = book;
        //this.books = updatedBooks;
        //this.booksUpdated.next([...this.books]);
        this.router.navigate(["/Donate"]);
      });
  }

  deleteBook(bookId: string) {
    return this.http
      .delete("http://localhost:3000/api/books/" + bookId);
      //.subscribe(() => {
        //const updatedBooks = this.books.filter(book => book.id !== bookId);
        //this.books = updatedBooks;
        //this.booksUpdated.next([...this.books]);
     // });
  }
}
