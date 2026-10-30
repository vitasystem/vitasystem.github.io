(() => {
  // Draw the same transparent image pixels on a canvas so browser icon
  // recoloring does not invert the decorative emblems.
  document.querySelectorAll('.portal-emblem img, .about-atom img').forEach(image => {
    const preserveColors = () => {
      if (!image.isConnected || !image.naturalWidth || !image.naturalHeight) return;
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.setAttribute('aria-hidden', 'true');
      canvas.dataset.source = image.getAttribute('src');
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(image, 0, 0);
      image.replaceWith(canvas);
    };
    if (image.complete && image.naturalWidth) preserveColors();
    else image.addEventListener('load', preserveColors, {once:true});
  });
})();
