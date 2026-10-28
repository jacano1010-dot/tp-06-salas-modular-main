# TP-06: Refactorización modular de reservas

## 1. Introducción

Para realizar este trabajo práctico tomé como punto de partida el proyecto que hice en el TP-05, que consiste en un sistema para gestionar los turnos de un gimnasio.

En el trabajo anterior, la mayor parte del código estaba concentrada en un solo archivo (`index.js`). El sistema funcionaba correctamente, pero a medida que se agregaban rutas, validaciones y otras funcionalidades, el código se hacía más largo y difícil de mantener.

Por eso, en este TP-06 refactoricé el proyecto para separar las responsabilidades en distintos módulos. La idea es mantener el funcionamiento que ya tenía el sistema, pero con una estructura más ordenada, donde cada archivo se encargue de una tarea específica.

No agregué una base de datos, ya que las reservas siguen almacenándose temporalmente en memoria, igual que en el trabajo anterior.

## 2. Instalación y ejecución

Para ejecutar el proyecto es necesario tener Node.js y npm instalados.

Primero, hay que abrir una terminal en la carpeta del proyecto e instalar las dependencias:

```bash
npm install
```

Para iniciar el servidor se utiliza:

```bash
npm start
```

Una vez iniciado, se puede acceder desde el navegador a:

- `http://localhost:3000/`: página de inicio.
- `http://localhost:3000/reservas`: listado de turnos.
- `http://localhost:3000/reservas/nueva`: formulario para registrar un turno.
- `http://localhost:3000/estado`: estado del sistema y cantidad de reservas.

Para detener el servidor se utiliza `Ctrl + C` en la terminal.

## 3. Configuración del entorno

La configuración se encuentra en el archivo `src/configuracion.js`. Desde ahí se obtiene el puerto del servidor y el entorno de ejecución.

Las variables utilizadas son:

- `PORT`: indica el puerto en el que se ejecuta el servidor. Si no se especifica, se utiliza el puerto 3000.
- `NODE_ENV`: indica el entorno de ejecución. Por defecto se utiliza `development`.

El puerto se valida para que sea un número entero entre 1 y 65535. Si el valor no cumple esas condiciones, la aplicación muestra un error al iniciar.

También se configura Morgan para registrar las solicitudes. En desarrollo utiliza el formato `dev` y en producción utiliza `combined`.

El archivo `.env.example` contiene los valores de ejemplo:

```env
PORT=3000
NODE_ENV=development
```

No es obligatorio crear un archivo `.env` para ejecutar el proyecto. Si se crea uno para configurar variables locales, debe quedar excluido del control de versiones mediante `.gitignore`.

## 4. Organización de los módulos

Para que el código sea más fácil de entender y mantener, separé las responsabilidades de la siguiente manera:

| Archivo | Responsabilidad |
| --- | --- |
| `src/index.js` | Es el punto de entrada. Carga la configuración, crea el servicio y el controlador, conecta los módulos e inicia el servidor. |
| `src/app.js` | Configura Express, los middlewares generales, las vistas, las rutas y la respuesta final para páginas inexistentes. |
| `src/configuracion.js` | Lee y valida las variables de entorno. |
| `src/rutas/reservas.js` | Define las rutas relacionadas con las reservas y conecta cada una con su controlador y middleware correspondiente. |
| `src/controladores/reservas.js` | Se encarga de las respuestas, de mostrar las vistas, de buscar los turnos y de solicitar la creación de una reserva al servicio. |
| `src/servicios/reservas.js` | Mantiene las reservas en memoria y contiene las operaciones para listar, buscar, contar y crear reservas. |
| `src/middleware/solicitudes.js` | Identifica cada solicitud con un ID y registra cuánto tarda en completarse. |
| `src/middleware/reservas.js` | Prepara la sección de reservas y valida los datos enviados desde el formulario. |

De esta manera, cada módulo tiene una responsabilidad más definida. Por ejemplo, la validación no se encuentra dentro del controlador y el controlador no necesita manejar directamente el arreglo de reservas.

## 5. Funcionamiento del servicio de reservas

El servicio de reservas es el encargado de trabajar con los datos del sistema. Al iniciar la aplicación se cargan cuatro reservas iniciales.

El servicio permite realizar las siguientes operaciones:

- Listar todas las reservas.
- Buscar una reserva por su ID.
- Consultar cuántas reservas hay registradas.
- Crear una nueva reserva y asignarle un ID.
- Obtener las sucursales y los turnos permitidos para el formulario.

En `index.js` se crea una sola instancia del servicio y esa misma instancia se utiliza desde los controladores.

Esto es importante porque permite que el listado, el detalle, la creación y la ruta `/estado` trabajen sobre los mismos datos. Por ejemplo, cuando se registra un nuevo turno, aumenta la cantidad que devuelve `/estado`.

## 6. Pipeline de Express

Se mantuvo el orden general de los middlewares que tenía el TP-05, separando las funcionalidades en archivos cuando correspondía.

El pipeline queda organizado de la siguiente manera:

1. Morgan registra las solicitudes HTTP.
2. `identificarSolicitud` asigna un identificador a cada solicitud.
3. `medirDuracion` registra el tiempo que tarda en completarse la respuesta.
4. Express EJS Layouts configura el uso de layouts.
5. Los archivos estáticos se sirven desde la carpeta `public`.
6. `express.urlencoded()` permite procesar los formularios.
7. `express.json()` permite procesar cuerpos JSON.
8. Se ejecutan las rutas de la aplicación y el router de reservas.
9. Si ninguna ruta responde, se muestra la página de error 404.

Los identificadores mantienen el formato `BIB-0001`, `BIB-0002` y así sucesivamente. Al finalizar una solicitud se registra el identificador, el método HTTP, la URL, el código de respuesta y la duración en milisegundos.

## 7. Rutas y respuestas HTTP

Las rutas principales del sistema son:

| Método | Ruta | Funcionamiento |
| --- | --- | --- |
| GET | `/` | Muestra la página de inicio. |
| GET | `/estado` | Devuelve un JSON con el estado del servicio, la cantidad de reservas y el ID de solicitud. |
| GET | `/reservas` | Muestra el listado de turnos registrados. |
| GET | `/reservas/nueva` | Muestra el formulario para registrar un nuevo turno. |
| GET | `/reservas/:id` | Muestra el detalle de una reserva existente. |
| POST | `/reservas` | Valida los datos, crea la reserva y redirige al listado. |

La ruta `/reservas/nueva` se define antes de `/reservas/:id` para evitar que la palabra `nueva` se interprete como un identificador.

Si se solicita un turno que no existe o una dirección que no está definida, se responde con el código HTTP 404 y se muestra la vista correspondiente.

Cuando los datos del formulario son inválidos, se devuelve el código 400, se muestran los errores y se conservan los valores ingresados para que puedan corregirse.

Cuando los datos son válidos, el middleware guarda la información validada en `req.reservaValidada` y continúa hacia el controlador. El controlador solicita al servicio la creación de la reserva y responde con una redirección 302 hacia `/reservas`.

## 8. Validaciones del formulario

Se mantuvieron las validaciones del TP-05 para evitar registrar turnos con datos incorrectos.

Los campos que se controlan son:

- Nombre del socio: es obligatorio.
- Email: es obligatorio y debe contener `@`.
- Sucursal: es obligatoria y debe ser una de las opciones permitidas.
- Fecha: es obligatoria.
- Turno: es obligatorio y debe ser una de las opciones permitidas.
- Cantidad de personas: debe ser un número entero entre 1 y 6.

Si algún dato no cumple las condiciones, la reserva no se crea y se devuelve el formulario con los mensajes de error correspondientes.

## 9. Comparación entre el TP-05 y el TP-06

| Aspecto | TP-05 | TP-06 |
| --- | --- | --- |
| Organización | La mayor parte del código estaba en `index.js`. | El código se separó en módulos. |
| Rutas | Se definían en el archivo principal. | Se organizaron en `src/rutas/reservas.js`. |
| Controladores | La lógica de las respuestas estaba dentro de las rutas. | Las acciones se separaron en `src/controladores/reservas.js`. |
| Servicio | El arreglo y las operaciones estaban en el archivo principal. | Las operaciones de reservas se encuentran en `src/servicios/reservas.js`. |
| Middleware | Las funciones estaban en el mismo archivo. | Se separaron la identificación, la medición de duración y la validación. |
| Configuración | El puerto estaba definido directamente en el código. | Se centralizó en `src/configuracion.js`, con validación de variables de entorno. |
| Formato y análisis | No estaban organizados con los comandos del TP-06. | Se incorporaron Prettier y ESLint. |
| Persistencia | Los datos se guardaban en memoria. | Se mantiene el almacenamiento temporal en memoria. |

El objetivo no fue cambiar el funcionamiento del sistema, sino ordenar el código y separar sus responsabilidades.

## 10. Formato y análisis estático

Se incorporaron Prettier y ESLint como herramientas de desarrollo.

Prettier permite mantener un formato uniforme en el código, mientras que ESLint detecta problemas de escritura y otras cuestiones que conviene corregir antes de ejecutar la aplicación.

Los comandos disponibles son:

```bash
npm run format
```

Formatea los archivos JavaScript de `src`.

```bash
npm run format:check
```

Comprueba si los archivos tienen el formato esperado sin modificarlos.

```bash
npm run lint
```

Ejecuta el análisis estático de ESLint.

```bash
npm run check
```

Ejecuta primero la comprobación de formato y después el análisis estático.

## 11. Persistencia y limitaciones

Las reservas se almacenan en un arreglo en memoria. Esto significa que los datos creados durante la ejecución están disponibles mientras el servidor permanece activo.

Cuando se detiene y se inicia nuevamente el servidor, se vuelven a cargar las cuatro reservas iniciales y se pierden las reservas creadas durante la ejecución anterior.

Esto se mantiene así porque el objetivo del trabajo es refactorizar el proyecto existente. No se incorporó una base de datos ni un sistema de persistencia.

Tampoco se agregaron funcionalidades ajenas a la consigna, como autenticación, nuevas API o cambios importantes en el diseño de las vistas.

## 12. Conclusión

Con este trabajo pude reorganizar el proyecto del TP-05 en distintos módulos, manteniendo el funcionamiento del sistema de turnos del gimnasio.

La separación entre configuración, aplicación, rutas, controladores, servicio y middleware hace que el código quede más ordenado y sea más sencillo de mantener.

Además, se conserva el comportamiento de las rutas, las validaciones del formulario, los registros de solicitudes y el almacenamiento temporal de las reservas. La principal diferencia respecto al trabajo anterior es la forma en que está organizado el código, no el objetivo del sistema.
