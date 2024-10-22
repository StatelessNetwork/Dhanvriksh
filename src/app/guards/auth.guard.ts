import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { applicationObject } from '../model/applicationEnum';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
 
export class AuthGuard implements CanLoad {

    constructor(private router: Router, private _storageService: StorageService) {}
  
    async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
      const data = await this._storageService.get(applicationObject.token);
      
      if (data) {
        const currentDateTime: any = new Date().getTime();
        const expiryDateTime = new Date(data.expirationDate).getTime();
  
        if (currentDateTime <= expiryDateTime) {
          // Token is valid, redirect to dashboard and prevent the module from loading
          return true; // Prevent loading of the module
        }
        else{
          this.router.navigateByUrl('/login', { replaceUrl: true });
          return false;
        }
      }
      else{
        this.router.navigateByUrl('/login', { replaceUrl: true });
          return false;
      }
    }
  }