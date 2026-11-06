# Coffee Orders Web

Frontend de Coffee Orders hecho con Next.js.

## Preguntas para revisar el ejercicio

### 1. ¿Qué archivo determina que exista la ruta `/orders`?

El archivo `src/app/orders/page.tsx`. En Next, cada carpeta dentro de `app` que tenga un `page.tsx` se vuelve una ruta, y el nombre de la carpeta es el nombre de la ruta.

### 2. ¿Por qué el encabezado no se copia dentro de las dos páginas?

Porque ya está en el `layout.tsx`, que envuelve todas las páginas. El encabezado se pone una sola vez ahí, y en `{children}` va la página en la que estés. Si lo pusiera también en cada página, se vería dos veces, y si quisiera cambiarlo tendría que hacerlo en varios lados.

### 3. ¿De dónde recibe `OrderCard` el nombre y la cantidad del producto?

Por props. La página de pedidos le pasa cada pedido a la tarjeta, y la tarjeta solo muestra `order.item` y `order.quantity`; no busca nada por su cuenta. Al principio los datos venían de `sampleOrders`, y ahora vienen de la API.

### 4. ¿Qué debe cambiar para agregar otro pedido sin duplicar el código de la tarjeta?

Solo los datos. Con los datos de práctica, se agrega otro objeto en `sample-orders.ts`; ahora que está conectado al backend, se crea el pedido en la API. El `map()` hace una tarjeta por cada pedido, así que no hay que tocar la tarjeta. El resumen también se actualiza solo, porque se calcula con `length` y `filter()`.

### 5. ¿Qué diferencia hay entre el `OrderSummary` del frontend y la entidad de TypeORM?

`OrderSummary` es solo un tipo de TypeScript que dice qué datos necesita la pantalla: `id`, `item`, `quantity` y `status`. No guarda nada ni valida nada. La entidad de TypeORM está en el backend: es la que define la tabla en la base de datos y se usa para guardar y leer los pedidos. Las validaciones y las reglas siguen estando en NestJS.

### 6. ¿Por qué filtrar la pantalla no cambia los pedidos del backend?

Porque el filtro solo cambia lo que se ve. Con `useState` se guarda si quiero ver todos o solo los pendientes, y con `filter()` se escogen cuáles mostrar de la lista que ya llegó. No cambia el estado de ningún pedido, no le manda nada a la API y no guarda nada. Si recargo la página, todo sigue igual en la base de datos.

## Para cerrar

### ¿Qué cambió al pasar de React con Vite a Next.js: cómo se dibuja la tarjeta o quién consulta la API?

La tarjeta se hace igual que antes: es un componente con JSX, recibe el pedido por props y la lista se arma con `map()`. Lo que cambió es quién le pide los datos a la API. En React con Vite lo hacía el navegador, con `useEffect`, `fetch` y `setOrders`. En Next.js lo hace el servidor de Next: la página `/orders` es `async`, hace el `fetch` a NestJS y le pasa los pedidos ya listos a las tarjetas.

### ¿Quién guarda el JWT y quién lo valida?

Lo guarda el navegador en una cookie llamada `coffee_token`. Cuando inicio sesión, NestJS me devuelve el token y la función `login` de Next lo guarda en esa cookie. Como es `httpOnly`, el JavaScript del navegador no la puede leer. Cada vez que entro a `/orders`, Next toma el token de la cookie y se lo manda a NestJS como `Authorization: Bearer ...`. El que de verdad revisa si el token sirve es NestJS. Si está vencido o no es válido, responde `401` y me devuelve al login.
