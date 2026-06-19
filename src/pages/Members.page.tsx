import { useEffect, useState, type FormEvent } from 'react';
import {
  IconAddressBook,
  IconAlertCircle,
  IconCircleCheck,
  IconFileText,
  IconLock,
  IconLogout,
  IconMail,
  IconUserCheck,
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { PageHeader } from '../components/church/PageHeader';
import { siteConfig } from '../content/churchContent';
import { getContent } from '../content/localizedContent';
import { useLocale } from '../lib/i18n';
import {
  completeEmailLinkSignIn,
  getMissingFirebaseConfigKeys,
  isMemberPortalConfigured,
  loadApprovedDirectory,
  loadMemberAccess,
  loadOwnProfile,
  loadPendingAccessRequests,
  requestMemberAccess,
  saveOwnProfile,
  sendMemberSignInLink,
  signOutMember,
  subscribeToAuth,
  updateMemberAccess,
  type DirectoryProfile,
  type MemberAccess,
} from '../lib/memberPortalFirebase';
import { getLocalizedPath } from '../lib/routing';
import classes from './Members.page.module.css';

type MemberSection = 'home' | 'directory' | 'giving';
type PortalUser = { uid: string; email: string | null };

const initialProfile = (email: string): Omit<DirectoryProfile, 'uid' | 'approved'> => ({
  displayName: '',
  email,
  phone: '',
  household: '',
  interests: '',
  optIn: false,
  visibility: {
    email: false,
    phone: false,
    household: false,
  },
});

const localizedPortalCopy = {
  en: {
    eyebrow: 'Member access',
    title: 'Member portal',
    description:
      'Sign in with an email link to request access, manage an opt-in directory profile, and find giving statement guidance.',
    setupTitle: 'Member portal setup is pending',
    setupCopy:
      'The public site is ready for Firebase Auth and Firestore, but the church Firebase project configuration has not been added yet.',
    missingConfig: 'Missing configuration keys:',
    signInTitle: 'Sign in by email link',
    signInCopy:
      'Enter the email address you want connected with your member access request. No password is created or stored by this site.',
    email: 'Email address',
    sendLink: 'Send sign-in link',
    linkSent: 'Check your email for a secure sign-in link.',
    signOut: 'Sign out',
    requestTitle: 'Request member access',
    requestCopy: 'A staff member must approve access before you can view the opt-in directory.',
    displayName: 'Display name',
    requestAccess: 'Request access',
    pendingTitle: 'Access request pending',
    pendingCopy: 'Your request has been saved. A church administrator still needs to approve it.',
    revokedTitle: 'Access unavailable',
    revokedCopy: 'Please contact the church office if you believe your access should be restored.',
    profileTitle: 'Directory profile',
    profileCopy:
      'Directory participation is optional. Profile edits are held for approval before appearing to other members.',
    phone: 'Phone',
    household: 'Household',
    interests: 'Ministries, interests, or notes',
    optIn: 'Include my approved profile in the member directory',
    showEmail: 'Show my email',
    showPhone: 'Show my phone',
    showHousehold: 'Show my household',
    saveProfile: 'Save profile',
    saved: 'Saved',
    directoryTitle: 'Opt-in member directory',
    directoryCopy: 'Only approved members can view profiles that other members chose to share.',
    emptyDirectory: 'No approved opt-in profiles are visible yet.',
    givingTitle: 'Giving statements and receipts',
    givingCopy:
      'The website does not store tax documents. Donation receipts and annual giving statements are handled through Tithely and the church office.',
    openTithely: 'Open Tithely giving',
    contactOffice: 'Contact the church office',
    adminTitle: 'Review pending access',
    adminCopy: 'Approved admins can approve or revoke member access requests.',
    approve: 'Approve',
    revoke: 'Revoke',
    noRequests: 'No pending access requests.',
    error: 'Something went wrong. Please try again or contact the church office.',
  },
  es: {
    eyebrow: 'Acceso de miembros',
    title: 'Portal de miembros',
    description:
      'Inicie sesión con un enlace por correo para solicitar acceso, administrar un perfil opcional del directorio y encontrar orientación sobre comprobantes de donaciones.',
    setupTitle: 'La configuración del portal está pendiente',
    setupCopy:
      'El sitio público está preparado para Firebase Auth y Firestore, pero falta agregar la configuración del proyecto Firebase de la iglesia.',
    missingConfig: 'Faltan estas claves de configuración:',
    signInTitle: 'Iniciar sesión por correo',
    signInCopy:
      'Ingrese el correo que desea conectar con su solicitud de acceso. Este sitio no crea ni guarda contraseñas.',
    email: 'Correo electrónico',
    sendLink: 'Enviar enlace',
    linkSent: 'Revise su correo para abrir el enlace seguro.',
    signOut: 'Cerrar sesión',
    requestTitle: 'Solicitar acceso de miembro',
    requestCopy:
      'Una persona del personal debe aprobar el acceso antes de que pueda ver el directorio opcional.',
    displayName: 'Nombre visible',
    requestAccess: 'Solicitar acceso',
    pendingTitle: 'Solicitud pendiente',
    pendingCopy: 'Su solicitud fue guardada. Un administrador de la iglesia aún debe aprobarla.',
    revokedTitle: 'Acceso no disponible',
    revokedCopy: 'Comuníquese con la oficina si cree que su acceso debe restaurarse.',
    profileTitle: 'Perfil del directorio',
    profileCopy:
      'Participar en el directorio es opcional. Los cambios se aprueban antes de aparecer para otros miembros.',
    phone: 'Teléfono',
    household: 'Hogar',
    interests: 'Ministerios, intereses o notas',
    optIn: 'Incluir mi perfil aprobado en el directorio de miembros',
    showEmail: 'Mostrar mi correo',
    showPhone: 'Mostrar mi teléfono',
    showHousehold: 'Mostrar mi hogar',
    saveProfile: 'Guardar perfil',
    saved: 'Guardado',
    directoryTitle: 'Directorio opcional de miembros',
    directoryCopy:
      'Solo miembros aprobados pueden ver perfiles que otros miembros decidieron compartir.',
    emptyDirectory: 'Todavía no hay perfiles aprobados visibles.',
    givingTitle: 'Comprobantes y recibos de donaciones',
    givingCopy:
      'El sitio no almacena documentos fiscales. Los recibos y comprobantes anuales se manejan mediante Tithely y la oficina de la iglesia.',
    openTithely: 'Abrir donaciones en Tithely',
    contactOffice: 'Contactar la oficina',
    adminTitle: 'Revisar solicitudes pendientes',
    adminCopy: 'Los administradores aprobados pueden aprobar o revocar solicitudes de acceso.',
    approve: 'Aprobar',
    revoke: 'Revocar',
    noRequests: 'No hay solicitudes pendientes.',
    error: 'Algo salió mal. Inténtelo de nuevo o comuníquese con la oficina.',
  },
};

export function MembersPage() {
  return <MemberPortalPage section="home" />;
}

export function MemberDirectoryPage() {
  return <MemberPortalPage section="directory" />;
}

export function MemberGivingStatementsPage() {
  return <MemberPortalPage section="giving" />;
}

function MemberPortalPage({ section }: { section: MemberSection }) {
  const locale = useLocale();
  const navigate = useNavigate();
  const copy = localizedPortalCopy[locale];
  const content = getContent(locale);
  const [user, setUser] = useState<PortalUser | null>(null);
  const [access, setAccess] = useState<MemberAccess | null>(null);
  const [profile, setProfile] = useState(() => initialProfile(''));
  const [directory, setDirectory] = useState<DirectoryProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<MemberAccess[]>([]);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const configured = isMemberPortalConfigured();

  useEffect(() => {
    if (!configured) {
      return undefined;
    }

    completeEmailLinkSignIn(window.location.href).catch(() =>
      setStatus({ type: 'error', message: copy.error })
    );

    return subscribeToAuth((nextUser) => {
      setUser(nextUser ? { uid: nextUser.uid, email: nextUser.email } : null);
    });
  }, [configured, copy.error]);

  useEffect(() => {
    if (!configured || !user) {
      setAccess(null);
      setDirectory([]);
      return;
    }

    loadPortalState(user).catch(() => setStatus({ type: 'error', message: copy.error }));
  }, [configured, user, copy.error]);

  async function loadPortalState(currentUser: PortalUser) {
    const nextAccess = await loadMemberAccess(currentUser.uid);
    setAccess(nextAccess);

    const ownProfile = await loadOwnProfile(currentUser.uid);
    setProfile(
      ownProfile
        ? {
            displayName: ownProfile.displayName,
            email: ownProfile.email || currentUser.email || '',
            phone: ownProfile.phone,
            household: ownProfile.household,
            interests: ownProfile.interests,
            optIn: ownProfile.optIn,
            visibility: ownProfile.visibility,
          }
        : initialProfile(currentUser.email ?? '')
    );
    setDisplayName(nextAccess?.displayName ?? currentUser.email ?? '');

    if (nextAccess?.status === 'approved') {
      setDirectory(await loadApprovedDirectory());
    }

    if (nextAccess?.status === 'approved' && nextAccess.role === 'admin') {
      setPendingRequests(await loadPendingAccessRequests());
    }
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setStatus(null);

    try {
      await sendMemberSignInLink(email, window.location.href.split('#')[0]);
      setStatus({ type: 'success', message: copy.linkSent });
    } catch {
      setStatus({ type: 'error', message: copy.error });
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRequestAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    setIsBusy(true);
    setStatus(null);

    try {
      await requestMemberAccess(user, displayName);
      await loadPortalState(user);
      setStatus({ type: 'success', message: copy.pendingCopy });
    } catch {
      setStatus({ type: 'error', message: copy.error });
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    setIsBusy(true);
    setStatus(null);

    try {
      await saveOwnProfile(user, profile);
      await loadPortalState(user);
      setStatus({ type: 'success', message: copy.saved });
    } catch {
      setStatus({ type: 'error', message: copy.error });
    } finally {
      setIsBusy(false);
    }
  }

  async function handleAccessChange(uid: string, nextStatus: 'approved' | 'revoked') {
    if (!user) {
      return;
    }

    setIsBusy(true);
    setStatus(null);

    try {
      await updateMemberAccess(user.uid, uid, nextStatus);
      setPendingRequests(await loadPendingAccessRequests());
      setStatus({ type: 'success', message: copy.saved });
    } catch {
      setStatus({ type: 'error', message: copy.error });
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />

      <Stack gap="xl" mt="xl">
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
            title={status.type === 'success' ? copy.saved : copy.error}
          >
            {status.message}
          </Alert>
        ) : null}

        {!configured ? <SetupPending copy={copy} /> : null}
        {configured && !user ? (
          <SignInPanel
            copy={copy}
            email={email}
            isBusy={isBusy}
            setEmail={setEmail}
            onSubmit={handleSignIn}
          />
        ) : null}
        {configured && user ? (
          <>
            <Group justify="space-between" align="center">
              <Badge variant="light" color={access?.status === 'approved' ? 'green' : 'moss'}>
                {user.email}
              </Badge>
              <Button
                variant="light"
                color="dark"
                leftSection={<IconLogout size={18} />}
                onClick={() => signOutMember()}
              >
                {copy.signOut}
              </Button>
            </Group>

            {!access ? (
              <AccessRequestPanel
                copy={copy}
                displayName={displayName}
                isBusy={isBusy}
                setDisplayName={setDisplayName}
                onSubmit={handleRequestAccess}
              />
            ) : null}

            {access?.status === 'pending' ? (
              <Alert color="moss" icon={<IconLock size={18} />} title={copy.pendingTitle}>
                {copy.pendingCopy}
              </Alert>
            ) : null}

            {access?.status === 'revoked' ? (
              <Alert color="red" icon={<IconAlertCircle size={18} />} title={copy.revokedTitle}>
                {copy.revokedCopy}
              </Alert>
            ) : null}

            {access?.status === 'approved' ? (
              <Tabs value={section} keepMounted={false}>
                <Tabs.List>
                  <Tabs.Tab
                    value="home"
                    leftSection={<IconUserCheck size={17} />}
                    onClick={() => navigate(getLocalizedPath('members', locale))}
                  >
                    {content.common.navigation.members}
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="directory"
                    leftSection={<IconAddressBook size={17} />}
                    onClick={() => navigate(getLocalizedPath('memberDirectory', locale))}
                  >
                    {content.common.navigation.memberDirectory}
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="giving"
                    leftSection={<IconFileText size={17} />}
                    onClick={() => navigate(getLocalizedPath('memberGivingStatements', locale))}
                  >
                    {content.common.navigation.memberGivingStatements}
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="home" pt="lg">
                  <SimpleGrid cols={{ base: 1, lg: access.role === 'admin' ? 2 : 1 }} spacing="xl">
                    <ProfilePanel
                      copy={copy}
                      isBusy={isBusy}
                      profile={profile}
                      setProfile={setProfile}
                      onSubmit={handleSaveProfile}
                    />
                    {access.role === 'admin' ? (
                      <AdminPanel
                        copy={copy}
                        isBusy={isBusy}
                        pendingRequests={pendingRequests}
                        onAccessChange={handleAccessChange}
                      />
                    ) : null}
                  </SimpleGrid>
                </Tabs.Panel>

                <Tabs.Panel value="directory" pt="lg">
                  <DirectoryPanel copy={copy} directory={directory} />
                </Tabs.Panel>

                <Tabs.Panel value="giving" pt="lg">
                  <GivingPanel copy={copy} locale={locale} />
                </Tabs.Panel>
              </Tabs>
            ) : null}
          </>
        ) : null}
      </Stack>
    </Container>
  );
}

function SetupPending({ copy }: { copy: (typeof localizedPortalCopy)['en'] }) {
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
      <Badge variant="light" color="moss" leftSection={<IconLock size={15} />}>
        Firebase
      </Badge>
      <Title order={2} mt="md">
        {copy.setupTitle}
      </Title>
      <Text c="dimmed" size="lg" mt="sm">
        {copy.setupCopy}
      </Text>
      <Text c="dimmed" mt="md">
        {copy.missingConfig} {getMissingFirebaseConfigKeys().join(', ')}
      </Text>
    </Paper>
  );
}

function SignInPanel({
  copy,
  email,
  isBusy,
  setEmail,
  onSubmit,
}: {
  copy: (typeof localizedPortalCopy)['en'];
  email: string;
  isBusy: boolean;
  setEmail: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
      <Title order={2}>{copy.signInTitle}</Title>
      <Text c="dimmed" size="lg" mt="sm">
        {copy.signInCopy}
      </Text>
      <form onSubmit={onSubmit}>
        <Group align="end" mt="lg">
          <TextInput
            label={copy.email}
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            type="email"
            required
            className={classes.emailInput}
          />
          <Button type="submit" loading={isBusy} leftSection={<IconMail size={18} />}>
            {copy.sendLink}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

function AccessRequestPanel({
  copy,
  displayName,
  isBusy,
  setDisplayName,
  onSubmit,
}: {
  copy: (typeof localizedPortalCopy)['en'];
  displayName: string;
  isBusy: boolean;
  setDisplayName: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
      <Title order={2}>{copy.requestTitle}</Title>
      <Text c="dimmed" size="lg" mt="sm">
        {copy.requestCopy}
      </Text>
      <form onSubmit={onSubmit}>
        <Group align="end" mt="lg">
          <TextInput
            label={copy.displayName}
            value={displayName}
            onChange={(event) => setDisplayName(event.currentTarget.value)}
            required
            className={classes.emailInput}
          />
          <Button type="submit" loading={isBusy}>
            {copy.requestAccess}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

function ProfilePanel({
  copy,
  isBusy,
  profile,
  setProfile,
  onSubmit,
}: {
  copy: (typeof localizedPortalCopy)['en'];
  isBusy: boolean;
  profile: Omit<DirectoryProfile, 'uid' | 'approved'>;
  setProfile: (profile: Omit<DirectoryProfile, 'uid' | 'approved'>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const update = (next: Partial<Omit<DirectoryProfile, 'uid' | 'approved'>>) =>
    setProfile({ ...profile, ...next });

  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
      <Title order={2}>{copy.profileTitle}</Title>
      <Text c="dimmed" mt="sm">
        {copy.profileCopy}
      </Text>
      <form onSubmit={onSubmit}>
        <Stack mt="lg">
          <TextInput
            label={copy.displayName}
            value={profile.displayName}
            onChange={(event) => update({ displayName: event.currentTarget.value })}
            required
          />
          <TextInput
            label={copy.email}
            value={profile.email}
            onChange={(event) => update({ email: event.currentTarget.value })}
            type="email"
          />
          <TextInput
            label={copy.phone}
            value={profile.phone}
            onChange={(event) => update({ phone: event.currentTarget.value })}
          />
          <TextInput
            label={copy.household}
            value={profile.household}
            onChange={(event) => update({ household: event.currentTarget.value })}
          />
          <TextInput
            label={copy.interests}
            value={profile.interests}
            onChange={(event) => update({ interests: event.currentTarget.value })}
          />
          <Checkbox
            label={copy.optIn}
            checked={profile.optIn}
            onChange={(event) => update({ optIn: event.currentTarget.checked })}
          />
          <Group>
            <Checkbox
              label={copy.showEmail}
              checked={profile.visibility.email}
              onChange={(event) =>
                update({
                  visibility: { ...profile.visibility, email: event.currentTarget.checked },
                })
              }
            />
            <Checkbox
              label={copy.showPhone}
              checked={profile.visibility.phone}
              onChange={(event) =>
                update({
                  visibility: { ...profile.visibility, phone: event.currentTarget.checked },
                })
              }
            />
            <Checkbox
              label={copy.showHousehold}
              checked={profile.visibility.household}
              onChange={(event) =>
                update({
                  visibility: { ...profile.visibility, household: event.currentTarget.checked },
                })
              }
            />
          </Group>
          <Button type="submit" loading={isBusy} w="fit-content">
            {copy.saveProfile}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

function DirectoryPanel({
  copy,
  directory,
}: {
  copy: (typeof localizedPortalCopy)['en'];
  directory: DirectoryProfile[];
}) {
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
      <Title order={2}>{copy.directoryTitle}</Title>
      <Text c="dimmed" mt="sm">
        {copy.directoryCopy}
      </Text>
      {directory.length === 0 ? (
        <Text c="dimmed" mt="lg">
          {copy.emptyDirectory}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="lg">
          {directory.map((profile) => (
            <Paper key={profile.uid} withBorder p="md">
              <Title order={3}>{profile.displayName}</Title>
              {profile.visibility.email && profile.email ? <Text>{profile.email}</Text> : null}
              {profile.visibility.phone && profile.phone ? <Text>{profile.phone}</Text> : null}
              {profile.visibility.household && profile.household ? (
                <Text>{profile.household}</Text>
              ) : null}
              {profile.interests ? (
                <Text c="dimmed" mt="sm">
                  {profile.interests}
                </Text>
              ) : null}
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </Paper>
  );
}

function GivingPanel({
  copy,
  locale,
}: {
  copy: (typeof localizedPortalCopy)['en'];
  locale: 'en' | 'es';
}) {
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
      <Title order={2}>{copy.givingTitle}</Title>
      <Text c="dimmed" size="lg" mt="sm">
        {copy.givingCopy}
      </Text>
      <Group mt="lg">
        <Button component="a" href={siteConfig.givingFormUrl} target="_blank" rel="noreferrer">
          {copy.openTithely}
        </Button>
        <Button component={Link} to={getLocalizedPath('contact', locale)} variant="light">
          {copy.contactOffice}
        </Button>
      </Group>
    </Paper>
  );
}

function AdminPanel({
  copy,
  isBusy,
  pendingRequests,
  onAccessChange,
}: {
  copy: (typeof localizedPortalCopy)['en'];
  isBusy: boolean;
  pendingRequests: MemberAccess[];
  onAccessChange: (uid: string, status: 'approved' | 'revoked') => void;
}) {
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
      <Title order={2}>{copy.adminTitle}</Title>
      <Text c="dimmed" mt="sm">
        {copy.adminCopy}
      </Text>
      {pendingRequests.length === 0 ? (
        <Text c="dimmed" mt="lg">
          {copy.noRequests}
        </Text>
      ) : (
        <Stack mt="lg">
          {pendingRequests.map((request) => (
            <Paper key={request.uid} withBorder p="md">
              <Group justify="space-between" align="center">
                <div>
                  <Text fw={800}>{request.displayName}</Text>
                  <Text c="dimmed" size="sm">
                    {request.email}
                  </Text>
                </div>
                <Group>
                  <Button
                    color="green"
                    loading={isBusy}
                    onClick={() => onAccessChange(request.uid, 'approved')}
                  >
                    {copy.approve}
                  </Button>
                  <Button
                    color="red"
                    variant="light"
                    loading={isBusy}
                    onClick={() => onAccessChange(request.uid, 'revoked')}
                  >
                    {copy.revoke}
                  </Button>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
