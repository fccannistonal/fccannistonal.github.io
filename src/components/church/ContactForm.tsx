import { useState, type FormEvent } from 'react';
import { IconAlertCircle, IconArrowRight, IconCircleCheck, IconMail } from '@tabler/icons-react';
import {
  Alert,
  Badge,
  Button,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { CONTACT_EMAIL, getContactFormEndpoint } from '../../lib/formConfig';
import classes from './ContactForm.module.css';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  name: '',
  email: '',
  phone: '',
  topic: 'Planning a visit',
  message: '',
};

const CONTACT_TOPICS = [
  'Planning a visit',
  'Prayer request',
  'Church ministries',
  'Community events',
  'Giving',
  'Something else',
];

function validateForm(values: FormValues) {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Please share your name.';
  }

  if (!values.email.trim()) {
    errors.email = 'Please share an email address.';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.message.trim()) {
    errors.message = 'Please add a message before sending.';
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus({ type: 'error', message: 'Please review the highlighted fields.' });
      return;
    }

    if (website) {
      setValues(INITIAL_VALUES);
      setStatus({
        type: 'success',
        message: 'Thanks for reaching out. Your message has been sent.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(getContactFormEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...values,
          _subject: `New FCC Anniston website message: ${values.topic}`,
          _template: 'table',
          _captcha: 'false',
          _url: window.location.href,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          errors?: Array<{ message?: string }>;
          message?: string;
        } | null;
        throw new Error(
          payload?.errors?.[0]?.message ??
            payload?.message ??
            'Unable to send your message right now. Please email or call the church instead.'
        );
      }

      setValues(INITIAL_VALUES);
      setWebsite('');
      setErrors({});
      setStatus({
        type: 'success',
        message: 'Thanks for reaching out. Your message has been sent.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to send your message right now.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius="xl" className={classes.formCard}>
      <Badge
        variant="light"
        color="brand"
        size="lg"
        leftSection={<IconMail size={15} stroke={1.8} />}
      >
        Start a conversation
      </Badge>
      <Title order={2} mt="md">
        Send us a message
      </Title>
      <Text c="dimmed" mt="sm" size="lg" maw={620}>
        Have a question, prayer request, or note before your first visit? Send it here and someone
        from the church will follow up.
      </Text>

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="md" mt="lg">
          {status ? (
            <Alert
              color={status.type === 'success' ? 'green' : 'red'}
              icon={
                status.type === 'success' ? (
                  <IconCircleCheck size={18} />
                ) : (
                  <IconAlertCircle size={18} />
                )
              }
              title={status.type === 'success' ? 'Message sent' : 'Unable to send'}
              radius="lg"
              role="status"
            >
              {status.message}
            </Alert>
          ) : null}

          <div className={classes.honeypot} aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="_honey"
              value={website}
              onChange={(event) => setWebsite(event.currentTarget.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Name"
              name="name"
              value={values.name}
              onChange={(event) => updateValue('name', event.currentTarget.value)}
              error={errors.name}
              autoComplete="name"
              required
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={(event) => updateValue('email', event.currentTarget.value)}
              error={errors.email}
              autoComplete="email"
              required
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={(event) => updateValue('phone', event.currentTarget.value)}
              description="Optional"
              autoComplete="tel"
            />
            <Select
              label="How can we help?"
              name="topic"
              data={CONTACT_TOPICS}
              value={values.topic}
              onChange={(value) => updateValue('topic', value ?? INITIAL_VALUES.topic)}
              allowDeselect={false}
            />
          </SimpleGrid>

          <Textarea
            label="Message"
            name="message"
            value={values.message}
            onChange={(event) => updateValue('message', event.currentTarget.value)}
            error={errors.message}
            minRows={7}
            autosize
            required
          />

          <Button
            type="submit"
            loading={isSubmitting}
            size="md"
            rightSection={<IconArrowRight size={18} />}
          >
            Send message
          </Button>

          <Text size="sm" c="dimmed" ta="center">
            Your message will be delivered to{' '}
            <Text component="a" href={`mailto:${CONTACT_EMAIL}`} inherit fw={700}>
              {CONTACT_EMAIL}
            </Text>
            . We will only use your contact details to respond.
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
