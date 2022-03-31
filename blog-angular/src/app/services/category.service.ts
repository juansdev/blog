import { Injectable } from "@angular/core";//Permite injectar este servicio como dependencia.
import { HttpClient, HttpHeaders } from "@angular/common/http";//Librerias que trabaja con el protocolo HTTP.
import { Observable } from "rxjs";//Envía la informacion y lee los datos recibidos de la API Backend.
import {Category} from "../models/category";
import { global } from "./global";

@Injectable()
export class CategoryService{
  public url: string;//Creo un estado

  constructor(
    private _http: HttpClient
  ){
    this.url = global.url;//Añado valor al estado url.
  };

  create(token:any,category:any):Observable<any>{
    let json = JSON.stringify(category);
    let params = "json="+json;
    let headers = new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded").set("Authorization",token);

    return this._http.post(this.url+"category",params,{headers:headers});
  }

  getCategories():Observable<any>{
    let headers = new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded");
    return this._http.get(this.url+"category",{headers:headers});
  }

  getCategory(id:number):Observable<any>{
    let headers = new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded");
    return this._http.get(this.url+"category/"+id,{headers:headers});
  }

  getPosts(id:number):Observable<any>{
    let headers = new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded");
    return this._http.get(this.url+"post/category/"+id,{headers:headers});
  }
};
