//IMPORTS NECESARIOS
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

//IMPORTAR COMPONENTES
import {LoginComponent} from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { UserEditComponent } from "./components/user-edit/user-edit.component";
import { CategoryNewComponent } from "./components/category-new/category-new.component";
import { PostNewComponent } from "./components/post-new/post-new.component";
import { PostDetailComponent } from "./components/post-detail/post-detail.component";
import { PostEditComponent } from "./components/post-edit/post-edit.component";
import { CategoryDetailComponent } from "./components/category-detail/category-detail.component";
import { ProfileComponent } from "./components/profile/profile.component";

//GUARD
import { IdentityGuard } from "./services/identity.guard";

//DEFINIR LAS RUTAS DEL SITIO WEB
const appRoutes: Routes = [
  {path:"",component:HomeComponent},
  {path:"inicio",component:HomeComponent},//Al ir a /inicio, renderizara el componente LoginComponent.
  {path:"iniciar_sesion",component:LoginComponent},
  {path:"salir/:sure",component:LoginComponent},
  {path:"registro",component:RegisterComponent},
  {path:"ajustes",component:UserEditComponent, canActivate:[IdentityGuard]},
  {path:"crear_categoria",component:CategoryNewComponent, canActivate:[IdentityGuard]},
  {path:"crear_entrada",component:PostNewComponent, canActivate:[IdentityGuard]},
  {path:"entrada/:id",component:PostDetailComponent},
  {path:"editar-entrada/:id",component:PostEditComponent, canActivate:[IdentityGuard]},
  {path:"categoria/:id",component:CategoryDetailComponent},
  {path:"perfil/:id",component:ProfileComponent},
  {path:"error",component:ErrorComponent},
  {path:"**", component:ErrorComponent}//El path "**", se lanzara cuando se carga una ruta no definida. 404 page.
];

//EXPORTAR CONFIGURACIÓN
export const appRoutingProviders:any[]=[];//Carga el Route como un servicio.
export const routing:ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);//Modulo del Route
