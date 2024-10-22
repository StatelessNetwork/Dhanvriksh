import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { applicationObject } from '../model/applicationEnum';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(private router: Router, private _storageService: StorageService) {}

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    const data = await this._storageService.get(applicationObject.token);
    
    if (data) {
      const currentDateTime: any = new Date().getTime();
      const expiryDateTime = new Date(data.expirationDate).getTime();

      if (currentDateTime <= expiryDateTime) {
        // Token is valid, redirect to dashboard and prevent the module from loading
        this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
        return false; // Prevent loading of the module
      }
    }

    // If no valid token, allow loading of the module
    return true;
  }
}