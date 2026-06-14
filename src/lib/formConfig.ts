export function getFormspreeEndpoint() {
  return import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim() ?? '';
}
