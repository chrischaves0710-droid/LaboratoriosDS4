'use strict';

const zonaFuego = document.querySelector('#zonaFuego');
const audioFuego = document.querySelector('#audioFuego');
const botonSonido = document.querySelector('#botonSonido');
const estadoSonido = document.querySelector('#estadoSonido');

let sonidoActivado = false;
let cursorSobreFuego = false;

audioFuego.volume = 0.5; // Cambiá este valor entre 0.0 y 1.0.

function actualizarEstado(mensaje) {
  estadoSonido.textContent = mensaje;
}

async function reproducirFuego() {
  zonaFuego.classList.add('activo');
  if (!sonidoActivado) return;

  try {
    await audioFuego.play();
    actualizarEstado('🔥 Estás escuchando el fuego.');
  } catch (error) {
    actualizarEstado('No se pudo reproducir. Revisá que exista assets/fuego.mp3.');
    console.warn('Error al reproducir el fuego:', error);
  }
}

function detenerFuego() {
  zonaFuego.classList.remove('activo');
  audioFuego.pause();
  audioFuego.currentTime = 0;
  actualizarEstado(
    sonidoActivado
      ? 'Sonido listo. Pasá el mouse por el fuego.'
      : 'El sonido está desactivado. Activá el botón para escucharlo.'
  );
}

// Mouse: el sonido empieza al entrar y se detiene al salir.
zonaFuego.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'touch') return;
  cursorSobreFuego = true;
  void reproducirFuego();
});

zonaFuego.addEventListener('pointerleave', () => {
  cursorSobreFuego = false;
  detenerFuego();
});

// Teclado: también funciona al enfocar el ícono con Tab.
zonaFuego.addEventListener('focus', () => {
  zonaFuego.classList.add('activo');
});
zonaFuego.addEventListener('blur', () => {
  if (!cursorSobreFuego) detenerFuego();
});

// En celulares, un toque sobre el ícono reproduce o detiene el fuego.
zonaFuego.addEventListener('click', () => {
  if (!sonidoActivado) {
    actualizarEstado('Primero activá el sonido con el botón inferior.');
    return;
  }
  if (audioFuego.paused) {
    void reproducirFuego();
  } else {
    detenerFuego();
  }
});

// Un clic explícito desbloquea el audio en navegadores con restricciones.
botonSonido.addEventListener('click', async () => {
  if (sonidoActivado) {
    sonidoActivado = false;
    botonSonido.textContent = '🔊 Activar sonido';
    botonSonido.setAttribute('aria-pressed', 'false');
    detenerFuego();
    return;
  }

  try {
    // El archivo debe existir en la carpeta assets.
    // Esta reproducción se solicita dentro de un clic del usuario.
    await audioFuego.play();
    audioFuego.pause();
    audioFuego.currentTime = 0;

    sonidoActivado = true;
    botonSonido.textContent = '🔇 Desactivar sonido';
    botonSonido.setAttribute('aria-pressed', 'true');
    actualizarEstado('¡Listo! Pasá el mouse sobre el fuego para escucharlo.');

    if (cursorSobreFuego) void reproducirFuego();
  } catch (error) {
    actualizarEstado('No se encontró el sonido. Agregá assets/fuego.mp3 y recargá.');
    console.error('No se pudo habilitar el sonido:', error);
  }
});
