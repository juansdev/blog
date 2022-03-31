# Blog

## Instalación

Blog fue desarrollado usando las siguientes versiones:
- Laravel v5.7.29.
- Angular v12.0.2.

Inicia el servidor Apache y MySQL.

En la carpeta "estructura de datos", se encuentra el archivo "database.sql" con el cual se puede importar la base de datos del proyecto.

Instala las dependencies y devDependencies y arranca el servidor de Laravel.

```
cd api-rest-laravel
composer install
npm update
php artisan serv
```

Y ahora en el lado del Frontend:

```
cd blog-angular
npm update --force
npm start
```

IMPORTANTE: Recuerda editar las credenciales de su base de datos en el archivo .env del Backend.

IMPORTANTE: Si el Backend esta escuchando mediante un puerto diferente al puerto 8000, siga la ruta "videos-angular/src/app/services" y modifica el archivo "global.ts", cambiando el puerto 8000 por el puerto que te aparece en la consola con el que desplegaste el backend.

## Licencia

MIT

**Uso Libre**
