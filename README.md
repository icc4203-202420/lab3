# Laboratorio 3: Uso de hooks con React y manejo de estado local

En este laboratorio continuaremos desarrollando la aplicación de clima con React y MUI. La aplicación utiliza la API de OpenWeather para acceder a información climática.

## Pasos iniciales

Para este laboratorio debes contar con una cuenta en OpenWeather, a través del portal openweathermap.org. Puedes usar para esto tu correo personal o institucional. Luego, ingresando al portal de OpenWeather, puedes pinchar en el menú en donde aparece tu login arriba a la derecha en la _top bar_ del sitio, y allí acceder a la opción "My API keys". Ingresando allí, verás la API Key que OpenWeather ha creado automáticamente para tu uso gratuito (máximo 1000 consultas diarias).

A continuación, crea un archivo llamado `.env` en el directorio raíz de este repositorio. En dicho archivo ingresa el siguiente texto:

```sh
VITE_OPENWEATHER_API_KEY=#[copia y pega aquí la API Key y elimina los corchetes y el caracter gato]
```

Luego, puedes ejecutar:

```sh
yarn install
```

Esto instalará todos los paquetes o módulos especificados en el archivo `package.json` que requiere la aplicación. Preferimos utilizar Yarn para gestión de módulos y dependencias de Javascript.

Con esto, la aplicación estará lista para ejecutar:

```sh
yarn dev
```

El comando anterior ejecuta la aplicación en modo de desarrollo. Puedes abrir el navegador web en [http://localhost:5173/](http://localhost:5173/) para ver el funcionamiento.

## Marco Teórico: Hooks en React

En React 18, los hooks son funciones especiales que permiten gestionar aspectos clave del ciclo de vida de los componentes funcionales, como el estado, los efectos secundarios, y otros comportamientos, de manera simple y eficiente. "Engancharse" a estas características significa que los hooks te permiten insertar lógica en puntos específicos del ciclo de vida de un componente funcional. 

**Hook useState**

El hook `useState` permite agregar estado a un componente funcional en React. Cuando llamas a `useState`, obtienes una pareja de valores: el estado actual y una función que te permite actualizar ese estado. La ventaja de usar `useState` es que React re-renderiza automáticamente el componente cada vez que el estado cambia, asegurando que la interfaz se actualice correctamente.

Ejemplo:

```markdown
### /examples/example1.html
```es6
import React, { useState } from 'react';

function Contador() {
  // Declara una nueva variable de estado, llamada "contador"
  const [contador, setContador] = useState(0);

  return (
    <div>
      <p>Has hecho clic {contador} veces</p>
      <button onClick={() => setContador(contador + 1)}>
        Haz clic
      </button>
    </div>
  );
}

export default Contador;
```

En este ejemplo, `useState(0)` inicializa el estado contador con un valor de 0. Cuando el usuario hace clic en el botón, se llama a `setContador`, lo que incrementa el valor de contador y provoca una re-renderización del componente, actualizando el número de clics mostrados.

**Hook useEffect**

El hook `useEffect` se utiliza para manejar efectos secundarios en los componentes de React. Esto incluye tareas como la recuperación de datos, la suscripción a servicios, o la manipulación directa del DOM. `useEffect` se ejecuta después de que el componente se haya renderizado y, por defecto, lo hace después de cada actualización. Sin embargo, también puede configurarse para ejecutarse solo cuando cambian ciertos valores.

```markdown
### /examples/example2.html
```es6
import React, { useState, useEffect } from 'react';

function Contador() {
  const [contador, setContador] = useState(0);

  // Hook useEffect para actualizar el título del documento
  useEffect(() => {
    document.title = `Has hecho clic ${contador} veces`;
  }, [contador]); // Solo vuelve a ejecutarse si cambia "contador"

  return (
    <div>
      <p>Has hecho clic {contador} veces</p>
      <button onClick={() => setContador(contador + 1)}>
        Haz clic
      </button>
    </div>
  );
}

export default Contador;
```

En este caso, el hook `useEffect` se utiliza para actualizar el título de la página cada vez que cambia el valor de contador. El segundo argumento de `useEffect` es un array de dependencias (`[contador]`), que indica que el efecto solo debe ejecutarse cuando contador cambie, optimizando así el rendimiento.

**Hook useReducer**

React 18 incluye un hook nativo llamado `useReducer` que permite manejar el estado de un componente de manera más compleja que `useState`. Este hook es ideal cuando el estado de un componente depende de múltiples acciones o cuando el estado es un objeto que requiere cambios basados en una lógica más estructurada por casos. Ejemplo de uso:

```markdown
### /examples/example3.html
```es6
import React, { useReducer } from 'react';

const initialState = { contador: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'incrementar':
      return { contador: state.contador + 1 };
    case 'decrementar':
      return { contador: state.contador - 1 };
    default:
      throw new Error('Acción no soportada');
  }
}

function Contador() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Contador: {state.contador}</p>
      <button onClick={() => dispatch({ type: 'incrementar' })}>
        Incrementar
      </button>
      <button onClick={() => dispatch({ type: 'decrementar' })}>
        Decrementar
      </button>
    </div>
  );
}

export default Contador;
```

La constante `initialState` define el estado inicial del componente, en este caso, un objeto con una propiedad contador inicializada en 0.

Luego, `reducer` es una función que toma _el estado actual y una acción_ como argumentos, y devuelve un nuevo estado basado en el tipo de acción. Aquí, el reducer maneja dos tipos de acciones: incrementar y decrementar.

El hook `useReducer` se usa para crear el estado y el método `dispatch`, que se utiliza para enviar acciones al reducer. Este hook recibe el reducer y el estado inicial como argumentos.

La función `dispatch` se utiliza para enviar acciones al reducer. Cuando se hace clic en los botones, se envían acciones con los tipos incrementar o decrementar, lo que provoca que el estado se actualice de acuerdo con la lógica definida en el reducer.

Este ejemplo es de juguete, pero a medida que las aplicaciones y los componentes se van haciendo más complejos en términos del estado que deben manejar, el uso de reducers hace que el código se vuelva más fácil de mantener y depurar. Con reducers todas las actualizaciones a una variable de estado pasan por definir todos los casos posibles de modificación de estado y cubrir correctamente esos casos.

**Bibliotecas de Hooks: Caso de Axios**

Además de los hooks nativos, existen bibliotecas de terceros que extienden la funcionalidad de React ofreciendo hooks personalizados que facilitan tareas comunes. Por ejemplo, `axios-hooks` es una biblioteca que proporciona hooks específicos para hacer solicitudes HTTP con Axios en React. Este hook simplifica la lógica de recuperación de datos y manejo de estados de carga o error en componentes funcionales. Ejemplo:

```es6
import React from 'react';
import useAxios from 'axios-hooks';

function ListaUsuarios() {
  const [{ data, loading, error }] = useAxios('https://api.example.com/users');

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los datos.</p>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default ListaUsuarios;
```

En este ejemplo, `useAxios` gestiona automáticamente los estados de carga (`loading`) y error (`error`). Así, los desarrolladores pueden enfocarse en la lógica de presentación sin preocuparse por las complejidades de la solicitud HTTP.

Para instalar `axios-hooks` en un proyecto usando Yarn, basta ejecutar:

```sh
yarn add axios-hooks
```

En este proyecto, el módulo ya está incorporado en `package.json`.

**Uso de Local Storage con Hooks**

Hemos visto en clases, y en la lectura del libro The Road to React, la existencia y el uso de la API de _Local Storage_, la cual está disponible en [sobre el 90%](https://caniuse.com/?search=localstorage) de los dispositivos móviles actuales. Para utilizar _Local Storage_ con React, es recomendable hacerlo a través de un módulo que provee un hook para ello, llamado  
`use-local-storage-state`, el cual puede ser instalado en un proyecto con:

```sh
yarn add use-local-storage-state
```

Ejemplo de uso:

```markdown
### /examples/example4.html
```es6
import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

function ContadorConLocalStorage() {
  const [contador, setContador] = useLocalStorageState('/examples/example4/contador', 0);

  return (
    <div>
      <p>Contador: {contador}</p>
      <button onClick={() => setContador(contador + 1)}>
        Incrementar
      </button>
      <button onClick={() => setContador(0)}>
        Reiniciar
      </button>
    </div>
  );
}

export default ContadorConLocalStorage;
```

El hook `useLocalStorageState` se utiliza en lugar de `useState` para crear una variable de estado que se sincroniza automáticamente con `localStorage`. Al pasar la clave `contador` como primer argumento, el valor de contador se almacena en `localStorage` bajo esa clave.

Cada vez que se actualiza el valor de `contador`, también se actualiza el valor almacenado en `localStorage`. Si el usuario recarga la página o vuelve a ella más tarde, el contador comenzará desde el valor que estaba en `localStorage` en lugar de resetearse.

Es importante notar que las claves guardadas en `localStorage` pueden colisionar entre aplicaciones distintas si no se toman precauciones. Por ejemplo, la clave `contador` es demasiado genérica y perfectamente podría ser utilizada en diferentes aplicaciones, con efectos no deseados, e incluso dañinos. Hay buenas prácticas para prevenir esto:

Uso de prefijos en las claves: Usar prefijos únicos para las claves en `localStorage` es una de las prácticas más comunes. Esto asegura que las claves sean únicas dentro del ámbito de tu aplicación, incluso si se usan nombres genéricos como `contador`. El prefijo podría incluir el nombre de la aplicación, el módulo, o alguna otra identificación única.

Ejemplo:

```es6
const [contador, setContador] = useLocalStorageState('miApp-contador', 0);
```

En este caso, `miApp-contador` se utiliza como clave en `localStorage`, lo que reduce el riesgo de colisiones con otras aplicaciones.

Uso de espacios de nombre (namespaces): Otra buena práctica es utilizar espacios de nombres o nombres jerárquicos. Esto es útil si tienes múltiples módulos o funcionalidades que necesitan almacenar datos en `localStorage`. Puedes estructurar las claves de manera jerárquica para organizar mejor los datos. Ejemplo:

```es6
const [contador, setContador] = useLocalStorageState('miApp/moduloA/contador', 0);
```

Este esquema de clave `miApp/moduloA/contador` asegura que la clave es específica a un módulo dentro de la aplicación, minimizando las posibilidades de colisión.

Uso de identificadores únicos: En algunos casos, podrías querer incluir identificadores únicos, como el ID de un usuario o el identificador de una sesión, en las claves. Esto es útil en aplicaciones que manejan múltiples usuarios o sesiones simultáneas. Ejemplo:

```es6
const userId = 'user123';
const [contador, setContador] = useLocalStorageState(`miApp/${userId}/contador`, 0);
```

Aquí, la clave `miApp/user123/contador` asegura que el estado es específico al usuario actual.

Es importante mantener una convención clara y consistente para nombrar las claves en `localStorage` a lo largo de la aplicación. Documentar estas convenciones ayudará a todos los desarrolladores en el equipo a seguir las mismas prácticas, reduciendo aún más la posibilidad de errores.

Por último, implementar validaciones y manejo de errores al interactuar con `localStorage` es una buena práctica para manejar situaciones inesperadas, como la falta de espacio o acceso denegado. También es recomendable comprobar que los valores obtenidos desde localStorage tienen el formato esperado.

```es6
const storedValue = localStorage.getItem('miApp-contador');
const contador = storedValue ? JSON.parse(storedValue) : 0;
```

## Descripción de la Aplicación React

Nuestra aplicación React en su segunda iteración ha crecido en funcionalidad. Permite buscar ubicaciones geográficas para realizar seguimiento del clima, y guardar ubicaciones favoritas. Para esto utiliza hooks de React nombrados arriba, `localStorage` y algunos componentes adicionales de MUI.

### Componentes de la Aplicación

**Index**

La página de carga de la aplicación SPA desarrollada con React es `index.html`. En este archivo se declara un elemento raíz de tipo `div` con `id` con valor `root`, y se carga el archivo `main.jsx`. Este último archivo instancia el componente principal de la aplicación llamado `App` (ver `App.jsx`):

```es6
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Asegúrate de importar el tema

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
        </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

**Theme de MUI**

Existe un _theme_ de MUI (Material UI) configurado para la aplicación que se encuentra descrito en `src/theme.js`. Es posible variar la tipografía Roboto utilizada en la aplicación, el esquema de colores, y en general alterar todas las propiedades personalizables de los componentes de MUI.

El componente `ThemeProvider` decora `App` con el _theme_ cargado en el propio archivo `main.jsx`.

**BrowserRouter**

Luego, hay un componente `BrowserRouter`, provisto por React, que permite que la aplicación de frontend pueda tener sus propios enlaces (hipervínculos) locales, y procesar los paths que hay en la barra de direcciones del navegador interpretándolos en el contexto local del frontend. Los enlaces permiten acceder a distintos componentes de la aplicación que quedan instanciados por el componente `App`. 

**React.StrictMode**

Finalmente `React.StrictMode` permite comunicar advertencias o errores al desarrollador respecto a prácticas erróneas en el desarrollo de la aplicación, asociadas a potenciales problemas de calidad.

**Componente App**

El archivo `App.jsx` declara el componente principal de la aplicación `App`. A este componente se ha incorporado el uso de _local storage_ para mantener la lista de ubicaciones favoritas del usuario para acceder a información climática. Esto quiere decir que el usuario puede cerrar la ventana (o pestaña del navegador), y la información sobre sus ciudades favoritas se mantendrá persistentemente en el almacenamiento local del navegador.

Para lo anterior, se usa el hook `useLocalStorageState` antes descrito. Para usar _local storage_ con este hook, se opta por definir namespaces jerarquizados; el primer namespace es el que tiene el nombre de la aplicación, `WeatherApp`, y bajo este namespace los componentes de la aplicación pueden definir sus propios namespaces para mantener variables en _local storage_:

```es6
const [initialFavorites] = useLocalStorageState('WeatherApp/App/Favorites', {
    defaultValue: ['Arica']
  });
```

El componente `App` es "dueño" de la lista de favoritos, la cual es utilizada tanto por los componentes `Search` como `Home`. Es decir ninguno de estos últimos componentes, como veremos más adelante, modifica directamente la lista de favoritos. Esto lo hace `App` a través de funciones de callback, y uso de una función reductora.

Todas las actualizaciones a la lista de favorito, como agregar favorito y quitar favorito, se realizan a través de la función reductora llamada `favoritesReducer`. Esta función es utilizada por el hook `useReducer` de `App`. Se pueden ver usos de la función despachadora `dispatch` definida por este hook en los manejadores de callback `handleAddFavorite` y `handleRemoveFavorite`.

El patrón reducer centraliza todas las operaciones de actualización de variables de estado, y obliga al desarrollador a definir y anticipar todos los estados posibles en el ciclo de vida de las variables. Esto permite desarrollar código más robusto y menos propenso a sufrir bugs por mal manejo de estado, lo cual es común si solamente se usa el hook `useState` para mantener el estado de todas las variables en los componentes.

**Componente Home**

El componente `Home` ha sido ampliado para mostrar una lista de pestañas (tabs), mediante los cuales es posible ver la información climática de acuerdo al estado de la lista de ubicaciones favoritas.

Notar que el componente `Home` recibe a través de _props_ la lista de favoritos, y la función para eliminar una ubicación favorita.

Es importante mencionar que se ha incorporado un módulo llamado `prop-types` al proyecto, el cual permite validar que las propiedades pasadas vía _props_ al componente sean del debido tipo. Esto aparece al final del archivo del componente `Home`:

```es6
Home.propTypes = {
  favorites: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeFavorite: PropTypes.func.isRequired,
};
```

En cada pestaña de MUI desplegada por el componente `Home` se instancia el componente `Weather` de acuerdo a la pestaña escogida.

**Componente Weather**

El componente Weather realiza llamadas a las APIs de OpenWeatherMap.

Dado que la consulta del clima requiere dos pasos; primero obtener las coordenadas de la ubicación a través de la API de Geocoder, y luego consultar a la API de clima utilizando coordenadas geodésicas. La función `fetchWeather`, definida asíncrona, ejecuta las llamadas a la API en forma secuencial, cuando el componente es montado (se ejecuta en `useEffect`).

La función tiene cierta complejidad debido a que las llamadas a la API de OpenWeatherMap son asíncronas y pueden ocurrir ciertas condiciones de carrera. La explicación detallada es la siguiente:

En un componente React, si haces una llamada asíncrona (por ejemplo, usando axios para obtener datos) dentro de un `useEffect`, y esa llamada aún no ha terminado cuando el componente se desmonta, podría haber un intento de actualizar el estado (`setWeather`, `setLoading`, `setError`) en un componente que ya no está montado. Esto puede llevar a errores y advertencias, como _"Can't perform a React state update on an unmounted component"_.

La variable _isMounted_ actúa como una bandera (flag) para indicar si el componente sigue montado o no. Se inicializa como true cuando el useEffect se ejecuta por primera vez, y luego se cambia a `false` en la función de limpieza (cleanup function) del `useEffect`, que se ejecuta cuando el componente se desmonta o cuando alguna de las dependencias del `useEffect` cambia.

El flujo del código con `isMounted` es el siguiente:

1. `isMounted` se inicializa como true cuando el `useEffect` se ejecuta por primera vez, lo que indica que el componente está montado.
2. Dentro de la función asíncrona `fetchWeather`, se realizan varias operaciones que incluyen esperar respuestas de la API. Durante este tiempo, el componente podría potencialmente desmontarse, por ejemplo, si el usuario navega a otro componente o si cambian las dependencias del `useEffect`.
3. Antes de actualizar el estado (`setWeather`, `setLoading`, `setError`), se verifica si `isMounted` sigue siendo `true`. Si lo es, significa que el componente todavía está montado, y es seguro realizar la actualización del estado. Si no lo está (`isMounted` es `false`), la función simplemente retorna y no se realiza ninguna actualización del estado.
4. Cuando el componente se desmonta o se vuelve a ejecutar el `useEffect` debido a un cambio en las dependencias (en este caso, location o apiKey), se ejecuta la función de limpieza (`return () => { isMounted = false; }`). Esto asegura que cualquier intento de actualizar el estado después de este punto será ignorado, porque isMounted será false.

**Componente Search**

El componente `Search` recibe vía _props_ la lista de ubicaciones favoritas, y la función de callback `onAddFavorite`, para ofrecer al usuario la posibilidad de agregar un resultado de búsqueda a la lista de ubicaciones favoritas alojada en el componente padre.

Por otro lado, el componente `Search` mantiene en _local storage_ una lista con las ubicaciones recientemente buscadas:

```es6
  const [keywordList, setKeywordList] = useLocalStorageState('WeatherApp/Search/KeywordList', {
    defaultValue: []
  });
```

Hay un hook de `useEffect` que se encarga de poblar la lista de ubicaciones recientemente buscadas, cuidando de no duplicar ubicaciones.

Para facilitar la búsqueda de ciudades, el componente rendeeriza el campo de texto para búsquedas embebido dentro de un componente de tipo `Autocomplete`. Este componente obtiene las ubicaciones recientemente buscadas en `keywordList`, variable asociada al hook `useLocalStorageState`.

## Experimenta con el código

1. Agrega el despliegue de la fecha y hora actual al componente `Weather`.
2. En el componente `Search` puedes agregar un botón para limpiar el historial de búsqueda, el cual aparezca desplegado únicamente si hay contenido en la lista de resultados guardada en local storage.
3. Puedes ampliar el despliegue de información climática en el componente `Weather` para mostrar una descripción textual del estado actual del clima. Para esto, puedes acceder al objeto `weather` en `weatherResponse`, el cual tiene la forma:
```es6
"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}]
```
4. El componente `Weather` contiene tres variables de estado (`weather`, `loading`, y `error`) que se actualizan en distintos lugares del código. Intenta hacer refactoring de este código para usar una función reductora (hook `useReducer`) para actualizar el estado de estas variables. La función reductora podría ser algo del estilo:

```es6
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        weather: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
```

## Anexo: Lo básico de Vite

Usamos Vite (https://vitejs.dev/) como andamiaje para crear nuestra aplicación utilizando React 18. Vite provee una serie de herramientas, por ejemplo, generadores parecidos a los que tiene una aplicación Rails, que permiten crear una aplicación de frontend a partir de cero, y preparar una aplicación para producción.

Si abres el archivo `package.json` verás que hay un objeto con clave `"scripts"` declarado. Este objeto define varias tareas posibles de realizar utilizando Vite, invocándolas con Yarn según nuestras preferencias de ambiente de desarrollo.

Los scripts relevantes son:

* `dev`: Permite levantar la aplicación en modo desarrollo como hemos visto arriba.
* `build`: Prepara la aplicación para ponerla en ambiente de producción.
* `lint`: Ejecuta linters para validar que el código cumpla estándares de codificación, y normas de calidad.
* `preview`: Permite previsualizar la aplicación después que ha sido construida con `build`.

