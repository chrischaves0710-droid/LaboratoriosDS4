# LabDS4-1 — Extintor interactivo clase A

Proyecto HTML + CSS + JavaScript puro. Basado en el rótulo de referencia.

## Organización

```
LabDS4-1/
├── index.html
├── style.css
├── script.js
└── assets/
    └── fuego.mp3  <-- Este audio lo agregás vos.
```

## Cómo usarlo

1. Abrí la carpeta `LabDS4-1` en Visual Studio Code.
2. Conseguí un efecto de sonido de fuego (formato MP3, preferiblemente sin voces).
3. Copialo a la carpeta `assets/` con el nombre exacto `fuego.mp3`.
4. En VS Code, abrí `index.html` con **Live Server** (opción **Open with Live Server**) o abrí el archivo desde tu explorador.
5. Hacé clic en **Activar sonido** una vez para permitir audio en el navegador.
6. Pasá el mouse por el ícono azul con llamas: se animará y reproducirá fuego en bucle. Al quitarlo, se detendrá.

Si no se oye, revisá el nombre del archivo (`fuego.mp3`), el volumen y la consola del navegador (F12).

## Personalización

- `style.css`: colores, tamaños, efectos visuales y animación `@keyframes flamear`.
- `script.js`: volumen (`audioFuego.volume = 0.5`), reproducción y eventos.
- `index.html`: texto y estructura del rótulo.

No requiere librerías ni instalaciones con npm.
