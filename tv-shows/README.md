# TV Shows — Laboratorio de asincronía (DS4)

Aplicación web para consultar una serie mediante su ID en TVMaze y mostrar las
valoraciones de todos sus episodios, agrupados por temporada.

## Tecnologías

- HTML5 y CSS3
- JavaScript moderno: módulos ES, `fetch()`, `async/await`, `Promise.all()` y `Object.groupBy()`
- API pública de TVMaze
- Vite (servidor de desarrollo, sin frameworks)

## Ejecutar en VS Code

1. Abrir la carpeta `tv-shows` en VS Code (o mantener abierto `LaboratoriosDS4`).
2. Abrir una terminal dentro de `tv-shows`.
3. Ejecutar:

   ```bash
   npm install
   npm run dev
   ```

4. Abrir en el navegador la URL local que muestra Vite (normalmente `http://localhost:5173/`).

Para preparar una versión de producción: `npm run build`. El resultado estará
en `dist/`.

## Probar

- Al iniciar se consulta el ID `2993`, usado en las diapositivas.
- Se puede escribir otro ID y seleccionar **Consultar serie**.
- Al dejar el cursor sobre un episodio aparece su nombre y valoración.
- Los episodios sin nota se muestran en gris.
- Si el ID es inexistente o la API falla, aparece un aviso.

Para encontrar IDs: https://api.tvmaze.com/search/shows?q=name

## Estructura

```text
tv-shows/
├── src/
│   ├── assets/placeholder.svg
│   ├── services/tvmaze.js
│   ├── index.html
│   ├── index.css
│   └── index.js
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## Créditos

Datos obtenidos de [TVMaze](https://www.tvmaze.com/).
Ejercicio educativo basado en las diapositivas de Desarrollo de Software IV.
