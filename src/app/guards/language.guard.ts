import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { applicationObject } from '../model/applicationEnum';

@Injectable({
  providedIn: 'root'
})
export class LanguageGuard implements CanLoad {
  constructor(private _storageService: StorageService, private router: Router) {}

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    const hasSeenLanguage = await this._storageService.get(applicationObject.language);

    if (hasSeenLanguage) {
      // If the user has already seen the intro, redirect to the login page
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return false;
    }
    // If the user hasn't seen the intro, allow the module to load
    return true;
  }
  
}
