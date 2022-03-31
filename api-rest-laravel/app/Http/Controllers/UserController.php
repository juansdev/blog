<?php

namespace App\Http\Controllers;

use App\Helpers\JwtAuth;
use App\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{

    public function register(Request $request){
        #Recoger los datos del usuario.
        $json = $request->input("json",null);
        $params = json_decode($json); //Objeto.
        $params_array = json_decode($json,true); //Array asociativo.

        if(!empty($params) && !empty($params_array)){
            #Limpiar datos
            $params_array = array_map("trim",$params_array);

            #Validar datos
            $validate = Validator::make($params_array,[
                "name"      => "required|regex:/[a-zA-ZÀ-ÿ ñ]+/",
                "surname"   => "required|regex:/[a-zA-ZÀ-ÿ ñ]+/",
                "email"     => "required|email|unique:users",
                "password"  => "required"
            ]);
            #unique:users => La validacion es verificar si ese email ya existe en la tabla, si no existe pues lo registra...

            if($validate->fails()){
                $data = array(
                    "status"=>"error",
                    "code"=>404,
                    "message"=>"El usuario no se ha creado.",
                    "errors"=>$validate->errors()
                );
            }
            else{
                #Cifrar la contraseña
                // $pwd = password_hash($params->password,PASSWORD_BCRYPT,["cost"=>4]); #La contraseña se cifrara 4 veces asi misma.
                $pwd = hash("sha256",$params->password); #La contraseña se cifrara 4 veces asi misma.

                #Crear el usuario
                $user = new User();
                $user->name = $params_array["name"];
                $user->surname = $params_array["surname"];
                $user->role = "ROLE_USER";
                $user->email = $params_array["email"];
                $user->password = $pwd;

                #Guardar el usuario en la BD.
                $user->save();

                $data = array(
                    "status"=>"success",
                    "code"=>200,
                    "message"=>"El usuario se ha creado correctamente."
                );
            }
        }
        else{
            $data = array(
                "status"=>"error",
                "code"=>404,
                "message"=>"Los datos enviados no son correctos."
            );
        }

        #Importante que todo lo que, Retorne sea en formato JSON.
        return response()->json($data,$data["code"]);
    }

    public function login(Request $request){
        $jwtAuth = new \JwtAuth();

        //Recibir daots por POST
        $json = $request->input("json",null);
        $params = json_decode($json);
        $params_array = json_decode($json,true);
        //Validar estos datos
        $validate = Validator::make($params_array,[
            "email"     => "required|email",
            "password"  => "required"
        ]);

        if($validate->fails()){
            $signup = array(
                "status"=>"error",
                "code"=>404,
                "message"=>"El usuario no se ha podido identificar.",
                "errors"=>$validate->errors()
            );
        }
        else{
            #Cifrar la contraseña
            $pwd = hash("sha256",$params->password);

            #Devolver token o datos
            $signup = $jwtAuth->signup($params->email,$pwd);
            if(!empty($params->gettoken)){
                $signup = $jwtAuth->signup($params->email,$pwd,true);
            }
        }
        return response()->json($signup,200);
    }

    public function update(Request $request){

        #{"name":"Juan","surname":"Serrano","email":"test@test.com","password":"ptoelklolea"}

        //Comprobar si el usuario esta identificado
        $token = $request->header("Authorization");
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

        //Recoger el usuario por POST
        $json = $request->input("json",null);
        $params_array = json_decode($json,true);

        if($checkToken && !empty($params_array)){
            //Sacar usuario identificado
            $user = $jwtAuth->checkToken($token,true);

            //Validar datos
            $validate = Validator::make($params_array,[
                "name"      => "required|alpha",
                "surname"   => "required|alpha",
                "email"     => "required|email|unique:users,".$user->sub
            ]);

            //Quitar los datos que no se desee actualizar
            unset($params_array["id"]);
            unset($params_array["role"]);
            unset($params_array["password"]);
            unset($params_array["created_at"]);
            unset($params_array["remember_token"]);

            //Actualizar usuario
            $user_update = User::where("id",$user->sub)->update($params_array);

            //Devolver array con resultados
            $data = array(
                "code"=>200,
                "status"=>"success",
                "user"=>$user,
                "changes"=>$params_array
            );
        }
        else{
            $data = array(
                "code"=>400,
                "status"=>'error',
                'message'=>"El usuario no esta identificado."
            );
        }
        return response()->json($data,$data["code"]);
    }

    public function upload(Request $request){
        //Recoger los datos de la peticion
        $image = $request->file("file0");

        //Validacion de imagen
        $validate = Validator::make($request->all(),[
            "file0"=>'required|mimes:jpg,jpeg,png,bmp,gif,svg,webp'
        ]);

        //Guardar imagen
        if(!$image || $validate->fails()){
            $data = array(
                "code"=>400,
                "status"=>"error",
                "message"=>"Error al subir imagen"
            );
        }
        else{
            $image_name = time().$image->getClientOriginalName();
            #Almacena la imagen en la carpeta llamada "users".
            Storage::disk("users")->put($image_name,\File::get($image));
            $data = array(
                "code"=>200,
                "status"=>"success",
                "image"=>$image_name
            );
        }

        //Devolver el resultado
        return response()->json($data,$data["code"]);
    }

    public function getImage($filename){
        $isset = Storage::disk("users")->exists($filename);
        if($isset){
            $file = Storage::disk("users")->get($filename);
            return new Response($file,200);
        }
        else{
            $data = array(
                "code"=>400,
                "status"=>"error",
                "message"=>"La imagen no existe."
            );
            return response()->json($data,$data["code"]);
        }
    }

    public function detail($id){
        $user = User::find($id);
        if(is_object($user)){
            $data = array(
                "code"=>200,
                "status"=>"success",
                "user"=>$user
            );
        }
        else{
            $data = array(
                "code"=>400,
                "status"=>"error",
                "message"=>"El usuario no existe."
            );
        }
        return response()->json($data,$data["code"]);
    }
}
