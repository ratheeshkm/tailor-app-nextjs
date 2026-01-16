if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('Service Worker registered:', registration);
        },
        (err) => {
          console.log('Service Worker registration failed:', err);
        }
      );
    });
  }
}
