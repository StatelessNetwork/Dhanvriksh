import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private _storage: Storage) {
    this._storage.create();
  }
  
  public async set(key:string,value:any){
  let result=await this._storage?.set(key,value);
  console.log(result)
  }

  public async get(key:string): Promise<any>{
    return await this._storage?.get(key)
  }

 public async removeItem(key:string): Promise<any>{
    await this._storage?.remove(key);
  }

 public async clear(): Promise<any>{
    await this._storage?.clear();
  }

  public async keys(): Promise<any>{
    let value=await this._storage?.keys();
    return value;
  }

}
