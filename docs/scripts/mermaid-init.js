document.addEventListener('DOMContentLoaded', () => {
  if (window.mermaid && typeof window.mermaid.initialize === 'function') {
    window.mermaid.initialize({ startOnLoad: true, theme: 'dark' });
  }
});
