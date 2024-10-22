import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { applicationObject } from '../model/applicationEnum';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {

  constructor(private _storageService: StorageService, private router: Router) {}

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    const hasSeenIntro = await this._storageService.get(applicationObject.isFirstTimeSliderhOpenApp);

    if (hasSeenIntro) {
      // If the user has already seen the intro, redirect to the login page
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return false;
    }
    this._storageService.set(applicationObject.isFirstTimeSliderhOpenApp,true)
    // If the user hasn't seen the intro, allow the module to load
    return true;
  }
}
