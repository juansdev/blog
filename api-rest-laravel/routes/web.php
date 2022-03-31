<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get("/test/{nombre?}",function($nombre=null){
//     // return "Tu nombre es: ".$nombre;
//     return view("pruebas",array(
//         "texto"=>"Tu nombre es: ".$nombre
//     ));
// });

//Cargando clases
use App\Http\Middleware\ApiAuthMiddleware;

Route::get('/', function () {
    return view('welcome');
});

//RUTAS DEL API

    //Rutas del controlador de usuario
    Route::get('/api/user/avatar/{filename}', "UserController@getImage");
    Route::get('/api/user/detail/{id}', "UserController@detail");
    Route::post('/api/register', "UserController@register");
    Route::post('/api/login', "UserController@login");
    Route::post('/api/user/upload', "UserController@upload")->middleware(ApiAuthMiddleware::class);
    Route::put('/api/user/update', "UserController@update");

    //Rutas del controlador de categoria
    Route::resource("/api/category","CategoryController");#Al hacer "php artisan route:list", se mostrara un CRUD creado a partir de esa ruta, se debe de crear los nombres ilustrados desde el controlador.

    //Rutas del controlador de entradas
    Route::get("/api/post/image/{filename}","PostController@getImage");
    Route::get("/api/post/category/{id}","PostController@getPostsByCategory");
    Route::get("/api/post/user/{id}","PostController@getPostsByUser");
    Route::post('/api/post/upload', "PostController@upload");
    Route::resource("/api/post","PostController");
