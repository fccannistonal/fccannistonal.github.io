import { useEffect, useState, type FormEvent } from 'react';
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
import { getContent } from '../../content/localizedContent';
import { CONTACT_EMAIL, getContactFormEndpoint } from '../../lib/formConfig';
import { trackContactFormSubmission } from '../../lib/googleAnalytics';
import { useLocale } from '../../lib/i18n';
import classes from './ContactForm.module.css';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const createInitialValues = (topic: string): FormValues => ({
  name: '',
  email: '',
  phone: '',
  topic,
  message: '',
});

export function ContactForm() {
  const locale = useLocale();
  const content = getContent(locale);
  const copy = content.contact.form;
  const [values, setValues] = useState(() => createInitialValues(copy.topics[0]));
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setValues((current) => ({ ...current, topic: copy.topics[0] }));
  }, [copy.topics]);

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = copy.nameRequired;
    }

    if (!values.email.trim()) {
      nextErrors.email = copy.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      nextErrors.email = copy.emailInvalid;
    }

    if (!values.message.trim()) {
      nextErrors.message = copy.messageRequired;
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus({ type: 'error', message: copy.validationSummary });
      return;
    }

    if (website) {
      setValues(createInitialValues(copy.topics[0]));
      setStatus({ type: 'success', message: copy.successMessage });
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
          language: locale,
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
        throw new Error(payload?.errors?.[0]?.message ?? payload?.message ?? copy.genericError);
      }

      setValues(createInitialValues(copy.topics[0]));
      setWebsite('');
      setErrors({});
      setStatus({ type: 'success', message: copy.successMessage });
      trackContactFormSubmission(locale);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : copy.genericError,
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
        {copy.badge}
      </Badge>
      <Title order={2} mt="md">
        {copy.title}
      </Title>
      <Text c="dimmed" mt="sm" size="lg" maw={620}>
        {copy.description}
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
              title={status.type === 'success' ? copy.successTitle : copy.errorTitle}
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
              label={copy.name}
              name="name"
              value={values.name}
              onChange={(event) => updateValue('name', event.currentTarget.value)}
              error={errors.name}
              autoComplete="name"
              required
            />
            <TextInput
              label={copy.email}
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
              label={copy.phone}
              name="phone"
              type="tel"
              value={values.phone}
              onChange={(event) => updateValue('phone', event.currentTarget.value)}
              description={copy.optional}
              autoComplete="tel"
            />
            <Select
              label={copy.topic}
              name="topic"
              data={copy.topics}
              value={values.topic}
              onChange={(value) => updateValue('topic', value ?? copy.topics[0])}
              allowDeselect={false}
            />
          </SimpleGrid>

          <Textarea
            label={copy.message}
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
            loaderProps={{ 'aria-label': copy.sending }}
            size="md"
            rightSection={<IconArrowRight size={18} />}
          >
            {copy.send}
          </Button>

          <Text size="sm" c="dimmed" ta="center">
            {copy.deliveryPrefix}{' '}
            <Text component="a" href={`mailto:${CONTACT_EMAIL}`} inherit fw={700}>
              {CONTACT_EMAIL}
            </Text>
            . {copy.deliverySuffix}
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
