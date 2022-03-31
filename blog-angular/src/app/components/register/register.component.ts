import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";//Utilizaremos el modelo User..
import { UserService } from "../../services/user.service";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[UserService]//Cargamos el servicio User...
})
export class RegisterComponent implements OnInit {
  public page_title:string;
  public user:User;//Creamos el estado con el Modelo User.
  public status:string;

  constructor(
    //Cargamos en el Component el servicio User...
    private _userService: UserService
  ) {
    this.status = "";
    this.page_title = "Registrate";
    this.user = new User(1, "", "", "", "", "ROLE_USER", "", "");//El valor inicial del estado sera un modelo User.
  }

  ngOnInit(): void {
  }

  onSubmit(form:any){
    this._userService.register(this.user).subscribe(
      response=>{
        if(response.status=="success"){
          // Respuesta del API recibido desde el Servicio
          this.status = response.status;
          form.reset();
        }
        else{
          this.status = "error";
        }
      },
      error => {
        this.status = "error";
        console.log(<any>error);
      }
    );//Utilizamos el servicio User, enviandole los datos del formulario Register...
    form.reset();//Vaciar formulario y resetear validaciones.
  }

};
