import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";

import { Injectable } from "@angular/core";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {//forces you to add an intercept method
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {//static type
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)//Authorization- bec. we're extracting out token from authorization on the backend(check-auth.js)
    });//authToken -value,
    return next.handle(authRequest);//handle - doesn't do anything, it just take a request and allow it to continue
  }
}

//interceptors - functions that will run on any outgoing HTTP request and we can then manipulate these outgoing request
//provided by HTTp client
