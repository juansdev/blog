import { Injectable } from "@angular/core";//Permite injectar este servicio como dependencia.
import { HttpClient, HttpHeaders } from "@angular/common/http";//Librerias que trabaja con el protocolo HTTP.
import { Observable } from "rxjs";//Envía la informacion y lee los datos recibidos de la API Backend.
import {User} from "../models/user";
import { global } from "./global";

@Injectable()
export class UserService{
  public url: string;//Creo un estado
  public token:any;
  public identity:any;
  constructor(
    private _http: HttpClient
  ){
    this.token = "";
    this.identity = {};
    this.url = global.url;//Añado valor al estado url.
  };
  test(){
    return "Hola mundo desde un servicio";
  }
  register(user:any):Observable<any>{
    //Observable<any>: Este metodo devolvera una respuesta "Observable" que seria la informacion recibida desde el API del Backend.
    let json = JSON.stringify(user);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded");//application/x-www-form-urlencoded: Tipo de contenido de un Formulario HTML.

    return this._http.post(this.url+"register",params,{headers:headers});//Enviamos una peticion POST al backend con los datos del formulario de registro.
  }

  signup(user:any,gettoken=false):Observable<any>{
    if(gettoken){
      user.gettoken = "true";
    }
    let json = JSON.stringify(user);
    let params = "json="+json;
    let headers = new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded");//application/x-www-form-urlencoded: Tipo de contenido de un Formulario HTML.

    return this._http.post(this.url+"login",params,{headers:headers});
  }

  update(token:any, user:any):Observable<any>{
    let json = JSON.stringify(user);
    let params = "json="+json;
    let headers = new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded").set("Authorization",token);
    return this._http.put(this.url+"user/update",params,{headers:headers});
  }

  getIdentity(){
    let identity = localStorage.getItem("identity");
    if (identity && identity != null){
      identity = JSON.parse(identity);
      this.identity = identity;
    }
    else{
      this.identity = null;
    }
    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem("token");
    if(token && token!="undefined"){
      this.token = token;
    }
    else{
      this.token = null;
    }
    return this.token;
  }

  getPosts(id:number):Observable<any>{
    let headers = new HttpHeaders()
                  .set("Content-Type","application/x-www-form-urlencoded");
    return this._http.get(this.url+"post/user/"+id,{headers:headers});
  }

  getUser(id:number):Observable<any>{
    let headers = new HttpHeaders()
                  .set("Content-Type","application/x-www-form-urlencoded");
    return this._http.get(this.url+"user/detail/"+id,{headers:headers});
  }
}
