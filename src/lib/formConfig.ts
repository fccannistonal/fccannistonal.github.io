export const CONTACT_EMAIL = 'fccannistonal@gmail.com';

export function getContactFormEndpoint() {
  return `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
}
