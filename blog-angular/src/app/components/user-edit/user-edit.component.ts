import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from "../../services/user.service";
import { global } from "../../services/global";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers:[UserService]
})
export class UserEditComponent implements OnInit {
  public page_title:string;
  public user:User;
  public status:string;
  public identity;
  public token;
  public floala_options: object;
  public afuConfig:object;
  public url:string;

  constructor(
    private _userService:UserService
  ){
    this.page_title = "Ajustes";
    this.url = global.url;
    this.status = "";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.floala_options = {
      charCounterCount: true,
      language: "es",
      toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
      toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
      toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
      toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
    };
    this.afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg,.jpeg,.png,.bmp,.gif,.svg,.webp",
      maxSize: "50",
      uploadAPI:  {
        url:global.url+"user/upload",
        method:"POST",
        headers: {
          "Authorization" : this._userService.getToken()
        },
      },
      theme: "attachPin",
      hideProgressBar: false,
      hideResetBtn: true,
      hideSelectBtn: false,
      fileNameIndex: true,
      attachPinText: 'Sube tu avatar de usuario'
    };

    // Rellenar objeto usuario
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.email,
      "",
      this.identity.role,
      this.identity.description,
      this.identity.image);//El valor inicial del estado sera un modelo User.
  }

  ngOnInit(): void {
  }
  onSubmit(form:any){
    this._userService.update(this.token,this.user).subscribe(
      response=>{
        if(response.status == "success"){
          this.status = "success";
          //Actualizar usuario en sesión
          if(response.changes.name){
            this.user.name = response.changes.name;
          }
          if(response.changes.surname){
            this.user.surname = response.changes.surname;
          }
          if(response.changes.email){
            this.user.email = response.changes.email;
          }
          if(response.changes.description){
            this.user.description = response.changes.description;
            response.user.description = response.changes.description;
          }
          if(response.changes.image){
            this.user.image = response.changes.image;
            response.user.image = response.changes.image;
          }
          this.identity = response.user;
          localStorage.setItem("identity",JSON.stringify(this.identity));
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

  avatarUpload(datos:any){
    let data = JSON.parse(datos.response);
    this.user.image = data.image;
  }
}
