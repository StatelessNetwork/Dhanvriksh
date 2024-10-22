import { Injectable } from '@angular/core';
import { CanLoad, NavigationStart, Route, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { applicationObject } from '../model/applicationEnum';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanLoad {
  constructor(private _storageService:StorageService,private router:Router){}

  canLoad(route: Route): any {

    return this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      take(1)
    )
    .subscribe((event: NavigationStart) => {
      const url: string = event.url;
      let currentDateTime:any= new Date().getTime();
      this._storageService.get(applicationObject.token).then( res => {
        if(res) {
          let expiryDateTime=new Date(res.expirationDate).getTime();
          if(currentDateTime<=expiryDateTime)
          return true;
          else{
            if(url.indexOf('login')>0)
              this.router.navigate(['/login']);
            else
              this.router.navigate(['/login',url]);
          return false;
          }
        } else {
          if(url.indexOf('login')>0)
            this.router.navigate(['/login']);
          else
            this.router.navigate(['/login',url]);
          return false;
        }
      }).catch(err => {
        if(url.indexOf('login')>0)
          this.router.navigate(['/login']);
        else
          this.router.navigate(['/login',url]);
        return false;
      });
    });
  
   
  }
}
