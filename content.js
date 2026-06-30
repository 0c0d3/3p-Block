function purgarTercerosUniversal() {
    // 
    const dominioActual = window.location.hostname;
    if (!dominioActual) return;

    // 
    // 
    const elementos = document.querySelectorAll('a[href], iframe[src], embed[src], object[data]');

    elementos.forEach(el => {
        try {
            // 
            const urlString = el.href || el.src || el.data;
            if (!urlString) return;

            // 
            const urlDestino = new URL(urlString, window.location.href);
            
            // 
            if (urlDestino.hostname && urlDestino.hostname !== dominioActual) {
                
                // CASO A: Si es un iframe o widget incrustado (típico de botones complejos, banners o feeds)
                if (el.tagName === 'IFRAME' || el.tagName === 'EMBED' || el.tagName === 'OBJECT') {
                    el.remove(); 
                } 
                
                // 
                else if (el.tagName === 'A') {
                    // Opción fulminante: Borra el botón de compartir de la pantalla por completo
                    el.remove();
                    
                    /* 
                    // 
                    // 
                    el.removeAttribute('href');
                    el.style.pointerEvents = 'none';
                    el.style.opacity = '0.5'; 
                    */
                }
            }
        } catch (e) {
            // 
        }
    });
}

// Ejecutar la limpieza apenas el script se inyecta en la página
purgarTercerosUniversal();

// 
const observador = new MutationObserver(purgarTercerosUniversal);
observador.observe(document.documentElement, { childList: true, subtree: true });