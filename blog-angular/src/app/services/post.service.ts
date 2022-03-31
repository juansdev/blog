import { Injectable } from "@angular/core";//Permite injectar este servicio como dependencia.
import { HttpClient, HttpHeaders } from "@angular/common/http";//Librerias que trabaja con el protocolo HTTP.
import { Observable } from "rxjs";//Envía la informacion y lee los datos recibidos de la API Backend.
import { Post } from "../models/post";
import { global } from "./global";

@Injectable()
export class PostService{
  public url: string;//Creo un estado

  constructor(
    private _http: HttpClient
  ){
    this.url = global.url;//Añado valor al estado url.
  };

  pruebas(){
    return "Hola desde el servicio de entradas!!!";
  }

  create(token:any,post:any):Observable<any>{
    let json = JSON.stringify(post);
    let params = "json="+json;
    let headers = new HttpHeaders()
                  .set("Content-Type","application/x-www-form-urlencoded")
                  .set("Authorization",token);
    return this._http.post(this.url+"post",params,{headers:headers});
  }

  getPosts():Observable<any>{
    let headers = new HttpHeaders()
                  .set("Content-Type","application/x-www-form-urlencoded");
    return this._http.get(this.url+"post",{headers:headers});
  }

  getPost(id:number):Observable<any>{
    let headers = new HttpHeaders()
                  .set("Content-Type","application/x-www-form-urlencoded");
    return this._http.get(this.url+"post/"+id,{headers:headers});
  }

  update(token:any,post:any,id:number):Observable<any>{
    let json = JSON.stringify(post);
    let params = "json="+json;
    let headers = new HttpHeaders()
                  .set("Content-Type","application/x-www-form-urlencoded")
                  .set("Authorization",token);
    return this._http.put(this.url+"post/"+id,params,{headers:headers});
  }

  delete(token:any,id:any){
    let headers = new HttpHeaders()
                  .set("Content-Type","application/x-www-form-urlencoded")
                  .set("Authorization",token);
    return this._http.delete(this.url+"post/"+id,{headers:headers});
  }
};
