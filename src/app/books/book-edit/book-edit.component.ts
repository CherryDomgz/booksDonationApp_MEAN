import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"; //FormFroup- reactive approach (disable ngModel)
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { BooksService } from '../books.service';
import { Book } from '../book.model';
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";

@Component ({
    selector: 'app-book-edit',
    templateUrl: './book-edit.component.html',
    styleUrls: ['./book-edit.component.css']
})

export class BookEditComponent implements OnInit, OnDestroy {
  enteredTitle ='';
  enteredIsbn ='';
  enteredPublicationDate ='';
  enteredAuthor ='';
  enteredPublications ='';
  book: Book;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "Donate";
  private bookId: string;
  private authStatusSub: Subscription;

  constructor(
    public booksService: BooksService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false; //if changes - disable spinner
    });

    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required] }),
      isbn: new FormControl(null, { validators: [Validators.required] }),
      publicationDate: new FormControl(null, { validators: [Validators.required] }),
      author: new FormControl(null, { validators: [Validators.required] }),
      publications: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("bookId")) {
        this.mode = "edit";
        this.bookId = paramMap.get("bookId");
        this.isLoading = true;
        this.booksService.getBook(this.bookId).subscribe(bookData => {
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
          this.form.setValue({
            title: this.book.title,
            isbn: this.book.isbn,
            publicationDate: this.book.publicationDate,
            author: this.book.author,
            publications: this.book.publications,
            image: this.book.imagePath
        });
      });
        } else {
          this.mode = "Donate";
          this.bookId = null;
      }
    });
}

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveBook () {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "Donate") {
      this.booksService.addBook (
        this.form.value.title,
        this.form.value.isbn,
        this.form.value.publicationDate,
        this.form.value.author,
        this.form.value.publications,
        this.form.value.image
      );
    } else {
      this.booksService.updateBook(
        this.bookId,
        this.form.value.title,
        this.form.value.isbn,
        this.form.value.publicationDate,
        this.form.value.author,
        this.form.value.publications,
        this.form.value.image );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

