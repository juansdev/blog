import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router  } from "@angular/router";
import { UserService } from "../../services/user.service";
import { PostService } from "../../services/post.service";
import { CategoryService } from "../../services/category.service";
import { Post } from "../../models/post";
import { global } from "../../services/global";

@Component({
  selector: 'post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers:[UserService,CategoryService,PostService]
})
export class PostNewComponent implements OnInit {

  public page_title: string;
  public identity;
  public token;
  public post:any;
  public url;
  public afuConfig:object;
  public floala_options:object;
  public categories:any;
  public status:string;
  public is_edit:boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService:PostService
  ) {
    this.page_title = "Crear una entrada";
    this.status = "";
    this.is_edit = false;
    this.url = global.url;
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
        url:global.url+"post/upload",
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
      attachPinText: 'Sube una imagen'
    };
  }

  ngOnInit(): void {
    this.getCategories();
    this.post = new Post(1,this.identity.sub,1,"","",null,null);
  }

  onSubmit(form:any){
    this._postService.create(this.token,this.post).subscribe(
      response=>{
        if(response.status == "success"){
          this.post == response.post;
          this.status = "success";
          this._router.navigate(["/inicio"]);
        }
        else{
          this.status = "error";
        }
      },
      error=>{
        console.log(<any>error);
        this.status = "error";
      }
    );
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response=>{
        if(response.status=="success"){
          this.categories = response.categories;
        }
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  imageUpload(data:any){
    let image_data = JSON.parse(data.response);
    this.post.image = image_data.image;
  }

}
