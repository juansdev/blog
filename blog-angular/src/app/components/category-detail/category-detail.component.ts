import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';
import { global } from "../../services/global";
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [PostService,CategoryService]
})
export class CategoryDetailComponent implements OnInit {

  public page_title:string;
  public category:Category;
  public posts: any;
  public url: string;
  public token: any;
  public identity;

  constructor(
    private _categoryService:CategoryService,
    private _userService:UserService,
    private _postService:PostService,
    private _router:Router,
    private _route:ActivatedRoute
  ) {
    this.page_title = "Detalle de categoría";
    this.url = global.url;
    this.category = new Category(1,"");
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
  }

  ngOnInit(): void {
    this.getPostsByCategory();
  }

  getPostsByCategory(){
    this._route.params.subscribe(params=>{
      let id = +params["id"];
      this._categoryService.getCategory(id).subscribe(
        response=>{
          if(response.status=="success"){
            this.category = response.category;
            this._categoryService.getPosts(id).subscribe(
              response=>{
                if(response.status == "success"){
                  this.posts = response.posts;
                }else{
                  this._router.navigate(["inicio"]);
                }
              },
              error=>{
                console.log(<any>error);
              }
            );
          }
        },
        error=>{
          this._router.navigate(["inicio"]);
        }
      );
    });
  }

  deletePost(id:number){
    this._postService.delete(this.token,id).subscribe(
      response=>{
        this.getPostsByCategory();
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

}
