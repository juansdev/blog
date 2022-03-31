import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from "../../models/post";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { PostService } from "../../services/post.service";
import { global } from "../../services/global";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:[PostService,UserService]
})
export class ProfileComponent implements OnInit {

  public url:string;
  public posts:any;
  public token;
  public identity;
  public user:User;

  constructor(
    private _postService:PostService,
    private _userService:UserService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.url = global.url;
    this.posts = "";
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
    this.user = new User(1,"","","","","","",null);
  }

  ngOnInit(): void {
    // Sacar el ide del post de la url
    this.getProfile();
  }

  getUser(userId:number){
    this._userService.getUser(userId).subscribe(
      response=>{
        this.user = response.user;
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  getProfile(){
    this._route.params.subscribe(params => {
      const userId = +params.id;
      this.getPosts(userId);
      this.getUser(userId);
    });
  }

  getPosts(userId:number){
    this._userService.getPosts(userId).subscribe(
      response=>{
        if(response.status=="success"){
          this.posts = response.posts;
        }
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  deletePost(id:number){
    this._postService.delete(this.token,id).subscribe(
      response=>{
        this.getProfile();
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

}
