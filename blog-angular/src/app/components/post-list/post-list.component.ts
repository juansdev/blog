import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//Input: Datos que se envian invocanda la etiqueta de este componente.
//Output:
//EventEmitter:

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  @Input() posts:any;
  @Input() identity:any;
  @Input() url:any;

  @Output() delete = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  deletePost(post_id:number){
    this.delete.emit(post_id); //Devolvera el valor del post_id al componente padre.
  }

}
