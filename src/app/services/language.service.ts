import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';
import { applicationObject } from '../model/applicationEnum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

 public resourceData: any[] = [];
 public dataTest: any = ['item1', 'item2', 'item3'];
  constructor(private translate: TranslateService,
    private _storage:StorageService) { 
    this.translate.setDefaultLang('en');
  }

  myFunction(): string {
    return 'Hello from the service!';
  }

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulating asynchronous operation
      setTimeout(() => {
        resolve(this.dataTest);
      }, 2000); // Resolves after 2 seconds
    });
  }

loadResourceKeys(): Observable<{ [key: string]: number }> {
  return new Observable<{ [key: string]: number }>((observer) => {
    setTimeout(() => {
      this._storage.get(applicationObject.language).then((lang: any) => {
        if (lang) {
            this.translate.getTranslation(lang).subscribe(translation => {
            let allTranslations: any = Object.keys(translation).map((key: string) => {
              return { key: key, value: translation[key] };
            });
            this._storage.set(applicationObject.resourceData, allTranslations);
            observer.next(allTranslations);
          });

        } else {
          this.setLanguage("en");
          this._storage.set(applicationObject.language, "en");

          this.translate.getTranslation("en").subscribe(translation => {
            let allTranslations: any = Object.keys(translation).map((key: string) => {
              return { key: key, value: translation[key] };
            });
            this._storage.set(applicationObject.resourceData, allTranslations);
            observer.next(allTranslations);
          });

        }
      });
    }, 1000); // Simulated delay of 1 second
  });
}

getResourceKeys(): Observable<{ [key: string]: number }> {
  return new Observable<{ [key: string]: number }>((observer) => {
    setTimeout(() => {
      this._storage.get(applicationObject.resourceData).then((data: any) => {
        if (data) {
          observer.next(data);
        } else {
          this.loadResourceKeys().subscribe((keys) => {
            observer.next(keys);
          });
        }
      });
    }, 0); // Simulated delay of 1 second
  });
}


getResourceData(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Simulating asynchronous operation
      this.getResourceKeys().subscribe(
        (data: any) => {
          if(data!=null){
            this.resourceData=data;
            resolve(this.resourceData);
          }
          else{
            this.loadResourceKeys();
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  });
}


 public filterAndGetValueByKey(resourceData:any,targetKey: string) {
      const filteredItems = resourceData.filter((item) => item.key === targetKey);
      const values = filteredItems.map((item) => item.value);
      if (values != null && values.length > 0)
        return values[0].toString(); // Convert to string
      else
        return "";
    } 

  setLanguage(language: string) {
    this.translate.use(language);
  }

    // Create a promise to resolve when translations are ready
    private getTranslations(keyName:string): Promise<void> {
      return new Promise<void>((resolve) => {
        this.translate.get([keyName]).subscribe(() => {
          resolve();
        });
      });
    }
  
    async loadTranslations(translationKey: string): Promise<string> {
      await this.getTranslations(translationKey); // Wait for translations to be ready
      return this.translate.instant(translationKey);
    }


}
