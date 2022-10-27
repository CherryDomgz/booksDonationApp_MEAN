import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()//add Injectable if you want to inject services into a service
export class AuthGuard implements CanActivate {//
  constructor(private authService: AuthService, private router: Router) {}
//click authguard and click the ligthbulb to show code action
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();//holds info if the user is authenticated or not
    if (!isAuth) {
      this.router.navigate(['/auth/Login']);
    }
    return isAuth;//true if authenticated
  }
}
//authuard - agnular add some interface your classes can implement which forces the class to add certain method which can execute before it loads
//a route to check whether ist should proceed or do something else
