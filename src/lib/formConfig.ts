export const CONTACT_EMAIL = 'fccannistonal@gmail.com';

export function getContactFormEndpoint() {
  return `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
}

export type MemberAccessNotification = {
  name: string;
  preferredName: string;
  email: string;
  phone: string;
  connection: string;
  note: string;
  locale: 'en' | 'es';
};

export async function notifyMemberAccessRequest(request: MemberAccessNotification) {
  const response = await fetch(getContactFormEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: request.name,
      preferredName: request.preferredName,
      email: request.email,
      phone: request.phone,
      connection: request.connection,
      message: request.note || 'No additional note was provided.',
      language: request.locale,
      _subject: `New FCC Anniston member area access request: ${request.name}`,
      _template: 'table',
      _captcha: 'false',
      _url: `${window.location.origin}${window.location.pathname}`,
    }),
  });
  if (!response.ok) {
    throw new Error('The staff email notification could not be sent.');
  }
}
