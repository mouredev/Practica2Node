# Nodepop API: Práctica JS/Node.js/MongoDB Boot VI (2017)
## Por Brais Moure Morais

REST API para Nodepop, una aplicación de compraventa de artículos. En este caso, orientada a artículos del tipo "***smartphone***".

## Requisitos
* **Node.js**. Versión usada: 8.9.1 ([https://nodejs.org/es/](https://nodejs.org/es/))
* **MongoDB**. Versión usada: 3.4.10 ([https://www.mongodb.com/es](https://www.mongodb.com/es))
* **NPM** como gestor de paquetes. Versión usada: 5.6.0 ([https://www.npmjs.com/](https://www.npmjs.com/))
* **GIT** ([https://git-scm.com/](https://git-scm.com/))

## Instalación
1. Descargar el proyecto. ([https://github.com/mouredev/Practica2Node.git](https://github.com/mouredev/Practica2Node.git))
2. Desde el directorio raíz, instalamos todas las dependencias del proyecto ejecutando:

`npm install`
 
3. Debemos tener arrancada nuestra BBDD MongoDB local.
4. Desde el directorio raíz podremos inicializar la base de datos de pruebas ejecutando:

`npm run loadDB`

> *De esta forma, nuestra base de datos con nombre "mongopop" quedará inicializada con 18 anuncios de smartphones y un usuario para pruebas.*

* User name: Test
* User email: test@test.com
* User password: test

5.  Desde la raíz del proyecto, también arrancaremos nuestro servidor usando uno de los siguiente comandos:

`npm start` *Ejecuta "node ./bin/www" (Sin debug ni nodemon)*

`npm run dev` *Ejecuta "DEBUG=nodeapi: nodemon ./bin/www" (Con debug y nodemon)*

> Nuestro servidor quedará arrancado en ***[http://localhost:3000](http://localhost:3000)*** 

> *NOTA: En este index podremos consultar este mismo README ya que cada vez que se inicia nuestro servidor se está realizando una tranformación de .md a .html, para mostrarlo así en el navegador como página de inicio.*

## Calidad del código

El proyecto posee configurado **ESLint** ([https://eslint.org/](https://eslint.org/)) para controlar la calidad del código. Para ejecutar el validador (solo se ejecuta en determinados directorios), podremos lanzar el siguiente script en la raíz del proyecto:

`npm run eslint`

# Operaciones API

## Versión

Nos encontramos en la versión 1 del API.

Todas las peticiones al API deberán realizarse sobre `{host}/apiv1/{endpoint_path}`.

## Internacionalización

El API soporta internacionalización a la hora de mostrar errores por idioma en el endpoint de usuarios **/users**.

* Soporte:
	* Español (**es**)
	* Inglés (**en**)

### 	Uso

Las peticiones al ***enpoint de usuarios*** podrán contener un parámetro en el body con nombre `lang` y el valor **es** o **en** para mostrar los posibles errores en el idioma seleccionado. El idioma por defecto en caso de no soportar el seleccionado o no existir el parámetro de configuración será **es**.

## Autenticación

Para realizar peticiones al API, deberemos poseer un usuario y estar autenticados con este en el sistema.

### Uso

Una vez registramos o poseemos los datos de acceso de un usuario, deberemos obtener el token de autenticación asociado a este. Para ello realizaremos una petición a **/users/authenticate** con el email y la contraseña de nuestro usuario. Esta petición nos retornará un token JWT con nombre `token`. 

La decodificación de este token nos proporcinará el nombre y el email del usuario en los campos `user` y `email`.

Dicho token tendremos que propagarlo enviándolo a cualquier endpoint del API que precise autenticación. Podremos enviarlo de las siguientes formas:

* El el body de la request dentro de la key `token`.
* En la query string de la petición con `?token={token}`.
* Como cabecera usando `x-access-token`.

## Usuarios. Ruta /users

Operaciones relacionadas con los usuarios del API.

> Este router no está autenticado.

Un usuario tendrá estos posibles campos:

`name: String,
email: String,
password: String`

> NOTA: Usar ***x-www-form-urlencoded***

### POST /users/authenticate

Autentica a un usuario en el API por email y contraseña.

**REQUEST**:

* Parámetros obligatorios: `email, password`
* Parámetros opcionales: `lang`

**RESPONSE**:

* Token JWT dentro de la variable `token`.

*{
"success": true,
"token": "jwt_token"
}*

**ERRORES**:

* HTTP 412 si no existe algún parámetro requerido.
* HTTP 401 si no existe el usuario que queremos autenticar por email y contraseña.

### PUT /users

Registra a un usuario por nombre, email y contraseña.

**REQUEST**:

* Parámetros obligatorios: `name, email, password`
* Parámetros opcionales: `lang`

**RESPONSE**:

* Usuario registrado sin el campo `password`.

*{
    "success": true,
    "result": {
        "__v": 0,
        "email": "test2@test.com",
        "name": "Test 2",
        "_id": "5a33cea9cbe40330ee2c712f"
    }
}*

**ERRORES**:

* HTTP 412 si no existe algún parámetro requerido o el email no es válido.

## Anuncios. Ruta /advertisements

Operaciones relacionadas con anuncios.

> Este router está autenticado.

Un anuncio tendrá estos posibles campos:

`name: String,
sale: Boolean,
price: Number,
photo: String,
tags: [String]`

### GET /advertisements/tags

Obtiene la lista de tags disponibles en los productos existentes.

**REQUEST**:

* No precisa parámetros.

**RESPONSE**:

* Array de tags.

*{
    "success": true,
    "result": [
        "android",
        "low",
        "nokia",
        "xiaomi",
        "motorola",
        "meizu",
        "bq",
        "mid",
        "samsung",
        "huawei",
        "high",
        "lg",
        "sony",
        "oneplus",
        "apple",
        "ios",
        "iphone",
        "google",
        "superhigh",
        "sumsung"
    ]
}*

### GET /advertisements/{limit}/{skip}

Obtiene una lista de anuncios paginados obligatoriamente (para evitar pedir todos a la vez) y con posible filtrado.

**REQUEST**:

* Parámetros obligatorios: La url debe contener siempre los parámetros `/{limit}/{skip}` para indicar el número de anuncios a recuperar con `limit` y desde qué posición deben recuperarse con `skip`. Por ejemplo, con `/advertisements/10/0` recuperaremos 10 anuncios empezando desde el primer resultado obtenido.

**REQUEST FILTERS**:

Esta operación permite realizar diferentes búsquedas de anuncios en base a criterios de filtrado. Estos criterios podrán usarse cada uno de ellos por separado o en conjunto.

* **Filtro por tag**. Filtra los anuncios por uno o varios tags.
	* Un tag: `/?tag={my_tag}`	 	
	* N tags: `/?tag={my_tag}&tag={my_tag2}...`

* 	**Filtro por tipo de anuncio**. Filtra si un anuncio está en venta o en búsqueda.
	* En venta: `/?sale=true`
	* En búsqueda: `/?sale=false`

* 	**Filtro por rango de precio**. Filtra anuncios por su rango de precio.
	*  Entre un mínimo y un máximo: `/?price={min}-{max}`
	*  Menores de: `/?price=-{max}`
	*  Mayores de de: `/?price={min}-`
	*  Iguales a: `/?price={price}`

* 	**Filtro por nombre**. Filtra anuncios por su nombre, por coincidencia insensitiva desde el principio.
	* `/?name={name} ` 
	

**RESPONSE**:

* Array de anuncios basados en los criterios de búsqueda.

*{
    "success": true,
    "result": [
        {
            "_id": "5a33b96b57c6d72fcd20bbe8",
            "name": "iPhone X",
            "sale": true,
            "price": 1159,
            "photo": "images/anuncios/iphonex.jpg",
            "__v": 0,
            "tags": [
                "superhigh",
                "iphone",
                "apple",
                "ios"
            ]
        },
        {
        ...
        }
    ]
}*

## Imágenes de anuncios. Ruta /images/anuncios

Podremos consultar la imagen pública de un anuncio mediante la url base de nuestro host más la proporcionada por el anuncio en el campo `photo`:

`{host}/{photo}`

*Por ejemplo [http://localhost:3000/images/anuncios/iphonex.jpg](http://localhost:3000/images/anuncios/iphonex.jpg)*

# Nodepop AWS: Práctica DevOps Boot VI (2018)
## Por Brais Moure Morais

Este proyecto se ha desplegado en una instancia EC2 de AWS con Nginx (como proxy inverso), Node, Mongo y PM2 junto con una web estática como indica la práctica.

### URL acceso Nodepop
Accediendo a la DNS pública del servidor [http://ec2-34-216-237-18.us-west-2.compute.amazonaws.com/](http://ec2-34-216-237-18.us-west-2.compute.amazonaws.com/) podremos consultar la página de inicio de este proyecto. Dicha web visualizará el contenido de este mismo README.md. Sobre esta raíz se podrán ejecutar todas las operaciones del API según idica su documentación.

### Verificación descarga archivos estáticos
Para poder verificar la cabecera HTTP personalizada `X-Owner: mouredev` podremos hacerlo en la propia página de inicio, revisando por ejemplo la descarga del archivo *style.css*, o directamente consultando una imagen como puede ser [http://ec2-34-216-237-18.us-west-2.compute.amazonaws.com/images/anuncios/iphonex.jpg](http://ec2-34-216-237-18.us-west-2.compute.amazonaws.com/images/anuncios/iphonex.jpg).

### URL acceso web estática
Accediendo directamente a la IP del servidor [http://34.216.237.18/](http://34.216.237.18/), podremos a visualizar la plantilla web estática desplegada y servida directamente por Nginx.
 
### Autor
*Brais Moure Morais. © 2017-2018*


 