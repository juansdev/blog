<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = "categories";#Se usara la tabla "categories"

    //Relacion de uno a muchos.
    public function posts(){
        return $this->hasMany("App\Post");#Retorna todos los objetos Post relacionado con el ID de la categoria.
    }
}
