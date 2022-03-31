<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = "posts";#Se usara la tabla "posts"

    protected $fillable = [
        "title","content","category_id","image"#Campos actualizables...
    ];

    //Relacion de uno a muchos inversa (Muchos a uno).
    public function user(){
        return $this->belongsTo('App\User','user_id');#Retorna todos los objetos User relacionados con el ID user_id del modelo Posts, si hay coincidencia con las ID del modelo User.
    }

    //Relacion de uno a muchos inversa (Muchos a uno).
    public function category(){
        return $this->belongsTo("App\Category","category_id");#Retorna todos los objetos Category relacionados con el ID category_id del modelo Posts, si hay coincidencia con las ID del modelo Category.
    }
}
