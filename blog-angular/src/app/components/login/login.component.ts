import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from 'src/app/models/user';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'login',//Etiqueta html que renderizara la vista de este componente.
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  //Declaracion de Estados
  public page_title:string;
  public user: User;
  public status:string;
  public token:any;
  public identity:any;

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _route: ActivatedRoute
  ) {
    //Valor del Estado
    this.status = "";
    this.token = "";
    this.identity = {};
    this.page_title = "Iniciar Sesión";
    this.user = new User(1, "", "", "", "", "ROLE_USER", "", "");//El valor inicial del estado sera un modelo User.
  }

  //ComponentDidMount
  ngOnInit(): void {
    //Cierra sesión siempre y cuando llega el parametro Sure por la URL.
    this.logout();
  }
  onSubmit(form:any){
    this._userService.signup(this.user).subscribe(
      response=>{
        //CONSEGUIDO TOKEN DEL USUARIO IDENTIFICADO
        if(response.status != "error"){
          this.status = "success";
          this.token = response;
          //CONSEGUIDO DATOS DEL TOKEN DEL USUARIO IDENTIFICADO
          this._userService.signup(this.user,true).subscribe(
            response=>{
                this.identity = response;

                //PERSISTIR DATOS USUARIO IDENTIFICADO

                localStorage.setItem("token",this.token);
                localStorage.setItem("identity",JSON.stringify(this.identity));

                //Redirección a inicio
                this._router.navigate(["/inicio"]);
            },
            error=>{
              this.status = "error";
              console.log(<any>error);
            }
          );
        }
        else{
          this.status = "error";
        }
      },
      error=>{
        this.status = "error";
        console.log(<any>error);
      }
    );
  }

  logout(){
    this._route.params.subscribe(
      params => {
        let logout = +params["sure"];//Convierto de string a int con el "+".
        if(logout==1){
          //ELIMINO PERSISTENCIA DEL USUARIO IDENTIFICADO
          localStorage.removeItem("identity");
          localStorage.removeItem("token");
          this.identity = null;
          this.token = null;

          //Redirección a inicio
          this._router.navigate(["/inicio"]);
        }
      }
    );
  }

}
