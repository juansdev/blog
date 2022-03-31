<?php

namespace App\Http\Controllers;

use App\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{

    public function __construct(){
        $this->middleware("api.auth",["except"=>["index","show"]]);#Quiero que se utilice el middleware en este controlador en todos los metodos excepto en "index" "show".
    }

    #SELECT * FROM CATEGORY
    public function index(){
        $categories = Category::all();
        return response()->json([
            "code"=>200,
            "status"=>"success",
            "categories"=>$categories
        ],200);
    }

    #SELECT * FROM CATEGORY WHERE ID = *;
    public function show($id){
        $category = Category::find($id);
        if(is_object($category)){
            $data = [
                "code"=>200,
                "status"=>"success",
                "category"=>$category
            ];
        }
        else{
            $data = [
                "code"=>400,
                "status"=>"error",
                "message"=>"La categoria no existe."
            ];
        }
        return response()->json($data,$data["code"]);
    }

    #INSERT FROM CATEGORY () VALUES ();
    public function store(Request $request){
        //Recoger los datos por POST
        $json = $request->input("json",null);
        $params_array = json_decode($json,true);
        //Validar los datos
        if(!empty($params_array)){
            $validate = Validator::make($params_array,[
                "name"=>"required"
            ]);
            //Guardar la categoria
            if($validate->fails()){
                $data = [
                    "code"=>400,
                    "status"=>"error",
                    "message"=>"No se ah guardado la categoria"
                ];
            }
            else{
                $category = new Category();
                $category->name = $params_array["name"];
                $category->save();
                $data = [
                    "code"=>200,
                    "status"=>"success",
                    "category"=>$category
                ];
            }
        }
        else{
            $data = [
                "code"=>400,
                "status"=>"error",
                "message"=>"No has enviado ninguna categoria"
            ];
        }
        //Devolver resultados
        return response()->json($data,$data["code"]);
    }

    #UPDATE
    public function update($id,Request $request){
        //Recoger los datos por POST
        $json = $request->input("json",null);
        $params_array = json_decode($json,true);
        if(!empty($params_array)){
            //Validar esos datos
            $validate = Validator::make($params_array,[
                "name"=>"required"
            ]);
            if($validate->fails()){
                $data = [
                    "code"=>400,
                    "status"=>"error",
                    "message"=>"No se ah actualizado la categoria"
                ];
            }
            else{
                //Quitar lo que no se quiere actualizar
                unset($params_array["id"]);
                unset($params_array["created_at"]);
                //Actualizar el registro de la categoria con dicha ID.
                $category = Category::where("id",$id)->update($params_array);
                $data = [
                    "code"=>200,
                    "status"=>"success",
                    "category"=>$category
                ];
            }
        }
        else{
            $data = [
                "code"=>400,
                "status"=>"error",
                "message"=>"No has enviado ninguna categoria"
            ];
        }
        return response()->json($data,$data["code"]);
    }
}
