import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router  } from "@angular/router";
import { UserService } from "../../services/user.service";
import { PostService } from "../../services/post.service";
import { CategoryService } from "../../services/category.service";
import { Post } from "../../models/post";
import { global } from "../../services/global";
import { Observable } from 'rxjs';

@Component({
  selector: 'post-edit',
  templateUrl: '../post-new/post-new.component.html',
  styleUrls: ['../post-new/post-new.component.css'],
  providers:[UserService,CategoryService,PostService]
})
export class PostEditComponent implements OnInit {

  public page_title: string;
  public identity;
  public url;
  public token;
  public post:any;
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
    this.page_title = "Editar entrada";
    this.status = "";
    this.url = global.url;
    this.is_edit = true;
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
      attachPinText: 'Cambiar imagen'
    };
  }

  ngOnInit(): void {
    this.getCategories();
    this.post = new Post(1,this.identity.sub,1,"","",null,null);
    this.getPost();
  }

  getPost() {
    // Sacar el ide del post de la url
    this._route.params.subscribe(params => {
      const id = +params.id;

      // Petición ajac para sacar los datos del post
      this._postService.getPost(id).subscribe(
        response => {
          if (response.status === 'success') {
            if(this.post.user_id != this.identity.sub){
              this._router.navigate(['/inicio']);
            }
            else{
              this.post = response.post;
            }
          } else {
            this._router.navigate(['/inicio']);
          }
        },
        error => {
          console.log(error);
          this._router.navigate(['/inicio']);
        }
      );
    });
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

  onSubmit(form:any){
    this._postService.update(this.token,this.post,this.post.id).subscribe(
      response=>{
        if(response.status == "success"){
          this.status == "success";
          this.post = response.post;
          this._router.navigate(["/entrada/",this.post.id]);
        }
        else{
          this.status == "error";
        }
      },
      error=>{
        this.status == "error";
        console.log(<any>error);
      }
    );
  }

}
