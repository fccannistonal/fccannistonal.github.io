/* eslint-disable no-alert */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  IconAddressBook,
  IconAlertCircle,
  IconCalendar,
  IconCamera,
  IconCircleCheck,
  IconFileText,
  IconLock,
  IconLogout,
  IconMessage,
  IconShield,
  IconTrash,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  FileInput,
  Group,
  Loader,
  Modal,
  MultiSelect,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { PageHeader } from '../components/church/PageHeader';
import { siteConfig } from '../content/churchContent';
import { useLocale } from '../lib/i18n';
import {
  changeMemberRole,
  changeMemberStatus,
  completeEmailLinkSignIn,
  createIcs,
  deleteCurrentAuthAccount,
  getMissingFirebaseConfigKeys,
  isMemberPortalConfigured,
  loadAdminGroups,
  loadAuditLogs,
  loadAvatarModeration,
  loadDirectoryPage,
  loadEvents,
  loadGroup,
  loadGroupMembers,
  loadGroupMembership,
  loadMemberAccess,
  loadMembersByStatus,
  loadMyGroups,
  loadOwnProfile,
  loadUpdates,
  migrateLegacyDirectoryEntry,
  processDeletion,
  removeGroupMembership,
  requestMemberAccess,
  requestProfileDeletion,
  saveEvent,
  saveGroup,
  saveGroupMembership,
  saveMemberProfile,
  saveOwnProfile,
  saveUpdate,
  sendMemberSignInLink,
  signOutMember,
  subscribeToAuth,
  type AuditLog,
  type AvatarMetadata,
  type DirectoryEntry,
  type DirectoryProfile,
  type GroupEvent,
  type GroupMembership,
  type GroupRole,
  type GroupUpdate,
  type MemberAccess,
  type MemberStatus,
  type PortalGroup,
} from '../lib/memberPortalFirebase';
import {
  deleteMyAvatar,
  fetchAvatar,
  isPhotoWorkerConfigured,
  moderateAvatar,
  prepareAvatar,
  removeMemberAvatar,
  uploadMemberAvatar,
  uploadMyAvatar,
} from '../lib/memberPortalPhotos';
import { getLocalizedPath, type RouteId } from '../lib/routing';
import classes from './Members.page.module.css';

type PortalSection =
  | 'profile'
  | 'directory'
  | 'groups'
  | 'group'
  | 'calendar'
  | 'updates'
  | 'admin'
  | 'giving';
type PortalUser = { uid: string; email: string | null };

const copyByLocale = {
  en: {
    eyebrow: 'Member community',
    title: 'Member portal',
    description:
      'Profiles, groups, events, and announcements for approved members of First Christian Church Anniston.',
    setupTitle: 'Member portal setup is pending',
    missing: 'Missing configuration:',
    signIn: 'Sign in by email',
    signInHelp: 'We will email you a secure sign-in link. New accounts require approval.',
    email: 'Email address',
    sendLink: 'Send sign-in link',
    linkSent: 'Check your email for the secure sign-in link.',
    request: 'Request member access',
    displayName: 'Full name',
    submitRequest: 'Submit request',
    pending: 'Your request is waiting for an administrator.',
    rejected: 'Your request was not approved. Contact the church office if this seems incorrect.',
    deactivated: 'Your portal access is deactivated.',
    banned: 'Your portal access is blocked.',
    deletionRequested: 'Your deletion request is being processed.',
    deleted: 'Your portal profile has been deleted.',
    profile: 'Profile',
    directory: 'Directory',
    groups: 'Groups',
    calendar: 'Calendar',
    updates: 'Updates',
    admin: 'Admin',
    giving: 'Giving statements',
    signOut: 'Sign out',
    save: 'Save changes',
    saved: 'Changes saved.',
    error: 'Something went wrong. Please try again.',
    loading: 'Loading member portal',
    empty: 'Nothing to show yet.',
    loadMore: 'Load more',
    preferredName: 'Preferred name',
    phone: 'Phone',
    pronouns: 'Pronouns',
    household: 'Household or family',
    interests: 'Ministry interests',
    directoryListed: 'Include me in the member directory',
    showEmail: 'Show my email',
    showPhone: 'Show my phone',
    showPronouns: 'Show my pronouns',
    showHousehold: 'Show my household',
    showPhoto: 'Show my approved photo',
    photo: 'Profile photo',
    photoHelp: 'Photos are cropped to a small square WebP and require administrator approval.',
    uploadPhoto: 'Upload photo',
    removePhoto: 'Remove photo',
    pendingPhoto: 'Your new photo is pending approval.',
    deletionTitle: 'Request profile deletion',
    deletionHelp:
      'This immediately blocks portal access while an administrator removes your profile and photo.',
    requestDeletion: 'Request deletion',
    confirmDeletion: 'Request deletion of your member profile?',
    deleteAuth: 'Delete my sign-in account',
    directoryHelp: 'Only information each member explicitly chose to share appears here.',
    groupsHelp: 'Church teams, leadership, ministries, committees, and small groups.',
    openGroup: 'Open group',
    createGroup: 'Create group',
    groupName: 'Group name',
    descriptionLabel: 'Description',
    category: 'Category',
    visibility: 'Visibility',
    statusLabel: 'Status',
    create: 'Create',
    archive: 'Archive group',
    groupSettings: 'Group settings',
    members: 'Members',
    addMember: 'Add member',
    roles: 'Group roles',
    saveRoles: 'Save roles',
    removeMember: 'Remove member',
    add: 'Add',
    events: 'Events',
    newEvent: 'New event',
    titleLabel: 'Title',
    location: 'Location',
    starts: 'Starts',
    ends: 'Ends',
    allDay: 'All-day event',
    publishEvent: 'Save event',
    addCalendar: 'Download .ics',
    canceled: 'Canceled',
    announcements: 'Announcements',
    newUpdate: 'New update',
    body: 'Message',
    important: 'Important',
    pinned: 'Pinned',
    publish: 'Publish update',
    adminHelp: 'Moderate member access, roles, photos, and audit history.',
    approve: 'Approve',
    reject: 'Reject',
    deactivate: 'Deactivate',
    ban: 'Ban',
    unban: 'Unban',
    reactivate: 'Reactivate',
    makeAdmin: 'Make admin',
    removeAdmin: 'Remove admin',
    editProfile: 'Edit profile',
    processDeletion: 'Process deletion',
    audit: 'Audit history',
    photos: 'Photo review',
    approvePhoto: 'Approve photo',
    rejectPhoto: 'Reject photo',
    adminUpload: 'Upload with member consent',
    consent: 'I confirm the member consented to this photo.',
    noAccess: 'You do not have permission to open this section.',
    givingHelp:
      'Tax documents are not stored in this portal. Tithely and the church office provide giving statements.',
    openTithely: 'Open Tithely',
    contactOffice: 'Contact church office',
  },
  es: {
    eyebrow: 'Comunidad de miembros',
    title: 'Portal de miembros',
    description:
      'Perfiles, grupos, eventos y anuncios para miembros aprobados de la Primera Iglesia Cristiana de Anniston.',
    setupTitle: 'La configuración del portal está pendiente',
    missing: 'Falta configuración:',
    signIn: 'Iniciar sesión por correo',
    signInHelp: 'Le enviaremos un enlace seguro. Las cuentas nuevas requieren aprobación.',
    email: 'Correo electrónico',
    sendLink: 'Enviar enlace',
    linkSent: 'Revise su correo para abrir el enlace seguro.',
    request: 'Solicitar acceso',
    displayName: 'Nombre completo',
    submitRequest: 'Enviar solicitud',
    pending: 'Su solicitud espera la revisión de un administrador.',
    rejected: 'Su solicitud no fue aprobada. Comuníquese con la oficina si cree que es un error.',
    deactivated: 'Su acceso al portal está desactivado.',
    banned: 'Su acceso al portal está bloqueado.',
    deletionRequested: 'Su solicitud de eliminación está en proceso.',
    deleted: 'Su perfil del portal fue eliminado.',
    profile: 'Perfil',
    directory: 'Directorio',
    groups: 'Grupos',
    calendar: 'Calendario',
    updates: 'Novedades',
    admin: 'Administración',
    giving: 'Comprobantes',
    signOut: 'Cerrar sesión',
    save: 'Guardar cambios',
    saved: 'Cambios guardados.',
    error: 'Algo salió mal. Inténtelo de nuevo.',
    loading: 'Cargando el portal',
    empty: 'No hay contenido todavía.',
    loadMore: 'Cargar más',
    preferredName: 'Nombre preferido',
    phone: 'Teléfono',
    pronouns: 'Pronombres',
    household: 'Hogar o familia',
    interests: 'Intereses ministeriales',
    directoryListed: 'Incluirme en el directorio',
    showEmail: 'Mostrar mi correo',
    showPhone: 'Mostrar mi teléfono',
    showPronouns: 'Mostrar mis pronombres',
    showHousehold: 'Mostrar mi hogar',
    showPhoto: 'Mostrar mi foto aprobada',
    photo: 'Foto de perfil',
    photoHelp: 'Las fotos se recortan a un WebP cuadrado pequeño y requieren aprobación.',
    uploadPhoto: 'Subir foto',
    removePhoto: 'Quitar foto',
    pendingPhoto: 'Su foto nueva espera aprobación.',
    deletionTitle: 'Solicitar eliminación del perfil',
    deletionHelp: 'Esto bloquea el acceso mientras un administrador elimina su perfil y foto.',
    requestDeletion: 'Solicitar eliminación',
    confirmDeletion: '¿Solicitar la eliminación de su perfil?',
    deleteAuth: 'Eliminar mi cuenta de acceso',
    directoryHelp: 'Solo aparece la información que cada miembro decidió compartir.',
    groupsHelp: 'Equipos, liderazgo, ministerios, comités y grupos pequeños.',
    openGroup: 'Abrir grupo',
    createGroup: 'Crear grupo',
    groupName: 'Nombre del grupo',
    descriptionLabel: 'Descripción',
    category: 'Categoría',
    visibility: 'Visibilidad',
    statusLabel: 'Estado',
    create: 'Crear',
    archive: 'Archivar grupo',
    groupSettings: 'Configuración del grupo',
    members: 'Miembros',
    addMember: 'Agregar miembro',
    roles: 'Funciones del grupo',
    saveRoles: 'Guardar funciones',
    removeMember: 'Quitar miembro',
    add: 'Agregar',
    events: 'Eventos',
    newEvent: 'Nuevo evento',
    titleLabel: 'Título',
    location: 'Lugar',
    starts: 'Comienza',
    ends: 'Termina',
    allDay: 'Evento de todo el día',
    publishEvent: 'Guardar evento',
    addCalendar: 'Descargar .ics',
    canceled: 'Cancelado',
    announcements: 'Anuncios',
    newUpdate: 'Nueva novedad',
    body: 'Mensaje',
    important: 'Importante',
    pinned: 'Fijado',
    publish: 'Publicar',
    adminHelp: 'Modere acceso, funciones, fotos e historial.',
    approve: 'Aprobar',
    reject: 'Rechazar',
    deactivate: 'Desactivar',
    ban: 'Bloquear',
    unban: 'Desbloquear',
    reactivate: 'Reactivar',
    makeAdmin: 'Hacer administrador',
    removeAdmin: 'Quitar administrador',
    editProfile: 'Editar perfil',
    processDeletion: 'Procesar eliminación',
    audit: 'Historial',
    photos: 'Revisión de fotos',
    approvePhoto: 'Aprobar foto',
    rejectPhoto: 'Rechazar foto',
    adminUpload: 'Subir con consentimiento',
    consent: 'Confirmo que el miembro dio permiso para esta foto.',
    noAccess: 'No tiene permiso para abrir esta sección.',
    givingHelp:
      'Este portal no guarda documentos fiscales. Tithely y la oficina proporcionan comprobantes.',
    openTithely: 'Abrir Tithely',
    contactOffice: 'Contactar la oficina',
  },
};

const emptyProfile = (uid: string, email: string): DirectoryProfile => ({
  uid,
  displayName: '',
  preferredName: '',
  email,
  phone: '',
  pronouns: '',
  household: '',
  ministryInterests: '',
  visibility: {
    listed: false,
    email: false,
    phone: false,
    pronouns: false,
    household: false,
    photo: false,
  },
});

export function MembersPage() {
  return <MemberPortalPage section="profile" />;
}
export function MemberProfilePage() {
  return <MemberPortalPage section="profile" />;
}
export function MemberDirectoryPage() {
  return <MemberPortalPage section="directory" />;
}
export function MemberGroupsPage() {
  return <MemberPortalPage section="groups" />;
}
export function MemberGroupPage() {
  return <MemberPortalPage section="group" />;
}
export function MemberCalendarPage() {
  return <MemberPortalPage section="calendar" />;
}
export function MemberUpdatesPage() {
  return <MemberPortalPage section="updates" />;
}
export function MemberAdminPage() {
  return <MemberPortalPage section="admin" />;
}
export function MemberGivingStatementsPage() {
  return <MemberPortalPage section="giving" />;
}

function MemberPortalPage({ section }: { section: PortalSection }) {
  const locale = useLocale();
  const copy = copyByLocale[locale];
  const [user, setUser] = useState<PortalUser | null>(null);
  const [access, setAccess] = useState<MemberAccess | null>(null);
  const [profile, setProfile] = useState<DirectoryProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const configured = isMemberPortalConfigured();

  const refresh = async (currentUser = user) => {
    if (!currentUser) {
      return;
    }
    const nextAccess = await loadMemberAccess(currentUser.uid);
    setAccess(nextAccess);
    const nextProfile = await loadOwnProfile(currentUser.uid);
    const resolved = nextProfile ?? emptyProfile(currentUser.uid, currentUser.email ?? '');
    setProfile(resolved);
    if (nextAccess?.status === 'approved' && nextProfile) {
      await migrateLegacyDirectoryEntry(nextProfile);
    }
  };

  useEffect(() => {
    if (!configured) {
      return undefined;
    }
    completeEmailLinkSignIn(window.location.href).catch(() =>
      setNotice({ type: 'error', text: copy.error })
    );
    return subscribeToAuth((nextUser) => {
      setUser(nextUser ? { uid: nextUser.uid, email: nextUser.email } : null);
      setAuthReady(true);
      if (!nextUser) {
        setAccess(null);
        setProfile(null);
      }
    });
  }, [configured, copy.error]);

  useEffect(() => {
    if (user) {
      refresh(user).catch(() => setNotice({ type: 'error', text: copy.error }));
    }
  }, [user]);

  const run = async (work: () => Promise<void>, success = copy.saved) => {
    setBusy(true);
    setNotice(null);
    try {
      await work();
      setNotice({ type: 'success', text: success });
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : copy.error });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Stack gap="xl" mt="xl">
        {notice ? (
          <Alert
            color={notice.type === 'success' ? 'green' : 'red'}
            icon={
              notice.type === 'success' ? (
                <IconCircleCheck size={18} />
              ) : (
                <IconAlertCircle size={18} />
              )
            }
            title={notice.type === 'success' ? copy.saved : copy.error}
          >
            {notice.text}
          </Alert>
        ) : null}
        {!configured ? <SetupPending copy={copy} /> : null}
        {configured && !authReady ? (
          <Center py="xl">
            <Loader aria-label={copy.loading} />
          </Center>
        ) : null}
        {configured && authReady && !user ? <SignIn copy={copy} busy={busy} run={run} /> : null}
        {configured && user ? (
          <>
            <Group justify="space-between">
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
              <AccessRequest copy={copy} user={user} busy={busy} run={run} refresh={refresh} />
            ) : null}
            {access && access.status !== 'approved' ? (
              <BlockedState copy={copy} access={access} busy={busy} run={run} refresh={refresh} />
            ) : null}
            {access?.status === 'approved' && profile ? (
              <PortalShell
                section={section}
                access={access}
                profile={profile}
                setProfile={setProfile}
                copy={copy}
                locale={locale}
                busy={busy}
                run={run}
                refresh={refresh}
              />
            ) : null}
          </>
        ) : null}
      </Stack>
    </Container>
  );
}

function SetupPending({ copy }: { copy: typeof copyByLocale.en }) {
  return (
    <Paper withBorder p="xl">
      <IconLock />
      <Title order={2} mt="md">
        {copy.setupTitle}
      </Title>
      <Text c="dimmed" mt="sm">
        {copy.missing} {getMissingFirebaseConfigKeys().join(', ')}
      </Text>
    </Paper>
  );
}

function SignIn({
  copy,
  busy,
  run,
}: {
  copy: typeof copyByLocale.en;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
}) {
  const [email, setEmail] = useState('');
  return (
    <Paper withBorder p="xl">
      <Title order={2}>{copy.signIn}</Title>
      <Text c="dimmed" mt="sm">
        {copy.signInHelp}
      </Text>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          run(() => sendMemberSignInLink(email, window.location.href.split('#')[0]), copy.linkSent);
        }}
      >
        <Group align="end" mt="lg">
          <TextInput
            className={classes.emailInput}
            label={copy.email}
            value={email}
            type="email"
            required
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <Button type="submit" loading={busy}>
            {copy.sendLink}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

function AccessRequest({
  copy,
  user,
  busy,
  run,
  refresh,
}: {
  copy: typeof copyByLocale.en;
  user: PortalUser;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  refresh: () => Promise<void>;
}) {
  const [name, setName] = useState('');
  return (
    <Paper withBorder p="xl">
      <Title order={2}>{copy.request}</Title>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          run(async () => {
            await requestMemberAccess(user, name);
            await refresh();
          }, copy.pending);
        }}
      >
        <Group align="end" mt="lg">
          <TextInput
            className={classes.emailInput}
            label={copy.displayName}
            value={name}
            required
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <Button type="submit" loading={busy}>
            {copy.submitRequest}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

function BlockedState({
  copy,
  access,
  busy,
  run,
  refresh,
}: {
  copy: typeof copyByLocale.en;
  access: MemberAccess;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  refresh: () => Promise<void>;
}) {
  const text = (copy[access.status as keyof typeof copy] as string) || copy.deactivated;
  return (
    <Paper withBorder p="xl">
      <Alert
        color={access.status === 'pending' ? 'moss' : 'red'}
        icon={<IconLock size={18} />}
        title={text}
      >
        {access.statusReason}
      </Alert>
      <Group mt="lg">
        <Button component={Link} to={getLocalizedPath('contact', useLocale())} variant="light">
          {copy.contactOffice}
        </Button>
        {access.status !== 'deletionRequested' && access.status !== 'deleted' ? (
          <Button
            color="red"
            variant="light"
            loading={busy}
            onClick={() => {
              if (window.confirm(copy.confirmDeletion)) {
                run(async () => {
                  await requestProfileDeletion(access);
                  await refresh();
                });
              }
            }}
          >
            {copy.requestDeletion}
          </Button>
        ) : null}
        {access.status === 'deleted' ? (
          <Button color="red" loading={busy} onClick={() => run(deleteCurrentAuthAccount)}>
            {copy.deleteAuth}
          </Button>
        ) : null}
      </Group>
    </Paper>
  );
}

function PortalShell({
  section,
  access,
  profile,
  setProfile,
  copy,
  locale,
  busy,
  run,
  refresh,
}: {
  section: PortalSection;
  access: MemberAccess;
  profile: DirectoryProfile;
  setProfile: (profile: DirectoryProfile) => void;
  copy: typeof copyByLocale.en;
  locale: 'en' | 'es';
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  refresh: () => Promise<void>;
}) {
  const navigate = useNavigate();
  const routeFor: Record<Exclude<PortalSection, 'group'>, RouteId> = {
    profile: 'memberProfile',
    directory: 'memberDirectory',
    groups: 'memberGroups',
    calendar: 'memberCalendar',
    updates: 'memberUpdates',
    admin: 'memberAdmin',
    giving: 'memberGivingStatements',
  };
  const tabs: Array<{
    value: Exclude<PortalSection, 'group' | 'giving'>;
    label: string;
    icon: ReactNode;
  }> = [
    { value: 'profile', label: copy.profile, icon: <IconUser size={17} /> },
    { value: 'directory', label: copy.directory, icon: <IconAddressBook size={17} /> },
    { value: 'groups', label: copy.groups, icon: <IconUsers size={17} /> },
    { value: 'calendar', label: copy.calendar, icon: <IconCalendar size={17} /> },
    { value: 'updates', label: copy.updates, icon: <IconMessage size={17} /> },
    ...(access.role === 'admin'
      ? [{ value: 'admin' as const, label: copy.admin, icon: <IconShield size={17} /> }]
      : []),
  ];
  const selected = section === 'group' || section === 'giving' ? 'groups' : section;
  return (
    <Stack gap="lg">
      <Tabs value={selected} className={classes.portalTabs}>
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              leftSection={tab.icon}
              onClick={() => navigate(getLocalizedPath(routeFor[tab.value], locale))}
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
      {section === 'profile' ? (
        <ProfilePanel {...{ profile, setProfile, copy, busy, run, refresh, access }} />
      ) : null}
      {section === 'directory' ? <DirectoryPanel copy={copy} /> : null}
      {section === 'groups' ? (
        <GroupsPanel copy={copy} access={access} locale={locale} busy={busy} run={run} />
      ) : null}
      {section === 'group' ? (
        <GroupPanel copy={copy} access={access} locale={locale} busy={busy} run={run} />
      ) : null}
      {section === 'calendar' ? <CalendarPanel copy={copy} access={access} /> : null}
      {section === 'updates' ? <UpdatesPanel copy={copy} access={access} /> : null}
      {section === 'admin' ? (
        access.role === 'admin' ? (
          <AdminPanel copy={copy} access={access} busy={busy} run={run} />
        ) : (
          <Alert color="red">{copy.noAccess}</Alert>
        )
      ) : null}
      {section === 'giving' ? <GivingPanel copy={copy} locale={locale} /> : null}
    </Stack>
  );
}

function ProfilePanel({
  profile,
  setProfile,
  copy,
  busy,
  run,
  refresh,
  access,
}: {
  profile: DirectoryProfile;
  setProfile: (profile: DirectoryProfile) => void;
  copy: typeof copyByLocale.en;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  refresh: () => Promise<void>;
  access: MemberAccess;
}) {
  const update = (next: Partial<DirectoryProfile>) => setProfile({ ...profile, ...next });
  const visibility = (key: keyof DirectoryProfile['visibility'], value: boolean) =>
    update({ visibility: { ...profile.visibility, [key]: value } });
  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
      <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
        <Title order={2}>{copy.profile}</Title>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            run(async () => {
              await saveOwnProfile(profile);
              await refresh();
            });
          }}
        >
          <Stack mt="lg">
            <TextInput
              label={copy.displayName}
              value={profile.displayName}
              required
              maxLength={100}
              onChange={(event) => update({ displayName: event.currentTarget.value })}
            />
            <TextInput
              label={copy.preferredName}
              value={profile.preferredName}
              maxLength={100}
              onChange={(event) => update({ preferredName: event.currentTarget.value })}
            />
            <TextInput label={copy.email} value={profile.email} disabled />
            <TextInput
              label={copy.phone}
              value={profile.phone}
              maxLength={40}
              onChange={(event) => update({ phone: event.currentTarget.value })}
            />
            <TextInput
              label={copy.pronouns}
              value={profile.pronouns}
              maxLength={60}
              onChange={(event) => update({ pronouns: event.currentTarget.value })}
            />
            <TextInput
              label={copy.household}
              value={profile.household}
              maxLength={150}
              onChange={(event) => update({ household: event.currentTarget.value })}
            />
            <Textarea
              label={copy.interests}
              value={profile.ministryInterests}
              maxLength={500}
              onChange={(event) => update({ ministryInterests: event.currentTarget.value })}
            />
            <Switch
              label={copy.directoryListed}
              checked={profile.visibility.listed}
              onChange={(event) => visibility('listed', event.currentTarget.checked)}
            />
            <Group>
              <Checkbox
                label={copy.showEmail}
                checked={profile.visibility.email}
                disabled={!profile.visibility.listed}
                onChange={(event) => visibility('email', event.currentTarget.checked)}
              />
              <Checkbox
                label={copy.showPhone}
                checked={profile.visibility.phone}
                disabled={!profile.visibility.listed}
                onChange={(event) => visibility('phone', event.currentTarget.checked)}
              />
              <Checkbox
                label={copy.showPronouns}
                checked={profile.visibility.pronouns}
                disabled={!profile.visibility.listed}
                onChange={(event) => visibility('pronouns', event.currentTarget.checked)}
              />
              <Checkbox
                label={copy.showHousehold}
                checked={profile.visibility.household}
                disabled={!profile.visibility.listed}
                onChange={(event) => visibility('household', event.currentTarget.checked)}
              />
              <Checkbox
                label={copy.showPhoto}
                checked={profile.visibility.photo}
                disabled={!profile.visibility.listed}
                onChange={(event) => visibility('photo', event.currentTarget.checked)}
              />
            </Group>
            <Button type="submit" loading={busy} w="fit-content">
              {copy.save}
            </Button>
          </Stack>
        </form>
      </Paper>
      <Stack>
        <AvatarPanel uid={profile.uid} copy={copy} busy={busy} run={run} />
        <Paper withBorder p="xl">
          <Title order={3}>{copy.deletionTitle}</Title>
          <Text c="dimmed" mt="sm">
            {copy.deletionHelp}
          </Text>
          <Button
            color="red"
            variant="light"
            mt="lg"
            leftSection={<IconTrash size={18} />}
            loading={busy}
            onClick={() => {
              if (window.confirm(copy.confirmDeletion)) {
                run(async () => {
                  await requestProfileDeletion(access);
                  await refresh();
                });
              }
            }}
          >
            {copy.requestDeletion}
          </Button>
        </Paper>
        <Button
          component={Link}
          to={getLocalizedPath('memberGivingStatements', useLocale())}
          variant="subtle"
          leftSection={<IconFileText size={18} />}
        >
          {copy.giving}
        </Button>
      </Stack>
    </SimpleGrid>
  );
}

function AvatarPanel({
  uid,
  copy,
  busy,
  run,
}: {
  uid: string;
  copy: typeof copyByLocale.en;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    if (isPhotoWorkerConfigured()) {
      fetchAvatar(uid, 'pending')
        .then((pending) => pending || fetchAvatar(uid))
        .then(setUrl);
    }
  }, [uid]);
  return (
    <Paper withBorder p="xl">
      <Title order={3}>{copy.photo}</Title>
      <Text c="dimmed" mt="sm">
        {copy.photoHelp}
      </Text>
      <Group mt="lg" align="end">
        <Avatar src={url} name={uid} size={88} />
        <FileInput
          accept="image/jpeg,image/png,image/webp"
          label={copy.photo}
          value={file}
          onChange={setFile}
          leftSection={<IconCamera size={16} />}
        />
      </Group>
      {isPhotoWorkerConfigured() ? (
        <Group mt="lg">
          <Button
            disabled={!file}
            loading={busy}
            onClick={() =>
              file &&
              run(async () => {
                const prepared = await prepareAvatar(file);
                await uploadMyAvatar(prepared);
                setUrl(await fetchAvatar(uid, 'pending'));
                setFile(null);
              }, copy.pendingPhoto)
            }
          >
            {copy.uploadPhoto}
          </Button>
          <Button
            color="red"
            variant="light"
            loading={busy}
            onClick={() =>
              run(async () => {
                await deleteMyAvatar();
                setUrl(null);
              })
            }
          >
            {copy.removePhoto}
          </Button>
        </Group>
      ) : (
        <Alert color="moss" mt="lg">
          {copy.setupTitle}
        </Alert>
      )}
    </Paper>
  );
}

function DirectoryPanel({ copy }: { copy: typeof copyByLocale.en }) {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [cursor, setCursor] =
    useState<Awaited<ReturnType<typeof loadDirectoryPage>>['cursor']>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const load = async (next = false) => {
    setLoading(true);
    const result = await loadDirectoryPage(next ? cursor : null);
    setEntries((current) => (next ? [...current, ...result.items] : result.items));
    setCursor(result.cursor);
    setDone(result.items.length < 24);
    setLoading(false);
  };
  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
      <Title order={2}>{copy.directory}</Title>
      <Text c="dimmed" mt="sm">
        {copy.directoryHelp}
      </Text>
      {loading && entries.length === 0 ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : entries.length === 0 ? (
        <Text c="dimmed" mt="xl">
          {copy.empty}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt="lg">
          {entries.map((entry) => (
            <MemberCard key={entry.uid} entry={entry} />
          ))}
        </SimpleGrid>
      )}
      {!done && entries.length ? (
        <Button variant="light" mt="lg" loading={loading} onClick={() => load(true)}>
          {copy.loadMore}
        </Button>
      ) : null}
    </Paper>
  );
}

function MemberCard({ entry }: { entry: DirectoryEntry }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (entry.showPhoto) {
      fetchAvatar(entry.uid).then(setUrl);
    }
  }, [entry.uid, entry.showPhoto]);
  return (
    <Paper withBorder p="lg">
      <Group align="flex-start">
        <Avatar src={url} name={entry.preferredName || entry.displayName} size="lg" />
        <div>
          <Text fw={800}>{entry.preferredName || entry.displayName}</Text>
          {entry.preferredName ? (
            <Text size="sm" c="dimmed">
              {entry.displayName}
            </Text>
          ) : null}
          {entry.pronouns ? <Text size="sm">{entry.pronouns}</Text> : null}
        </div>
      </Group>
      <Stack gap={2} mt="md">
        {entry.email ? <Text size="sm">{entry.email}</Text> : null}
        {entry.phone ? <Text size="sm">{entry.phone}</Text> : null}
        {entry.household ? <Text size="sm">{entry.household}</Text> : null}
        {entry.ministryInterests ? (
          <Text size="sm" c="dimmed" mt="xs">
            {entry.ministryInterests}
          </Text>
        ) : null}
      </Stack>
    </Paper>
  );
}

function GroupsPanel({
  copy,
  access,
  locale,
  busy,
  run,
}: {
  copy: typeof copyByLocale.en;
  access: MemberAccess;
  locale: 'en' | 'es';
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
}) {
  const [groups, setGroups] = useState<PortalGroup[]>([]);
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ministry');
  const [visibility, setVisibility] = useState('allApproved');
  const reload = () =>
    (access.role === 'admin' ? loadAdminGroups() : loadMyGroups(access.uid)).then(setGroups);
  useEffect(() => {
    reload();
  }, [access.uid]);
  return (
    <Stack>
      <Group justify="space-between">
        <div>
          <Title order={2}>{copy.groups}</Title>
          <Text c="dimmed">{copy.groupsHelp}</Text>
        </div>
        {access.role === 'admin' ? (
          <Button onClick={() => setOpened(true)}>{copy.createGroup}</Button>
        ) : null}
      </Group>
      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
        {groups.map((item) => (
          <Paper key={item.id} withBorder p="lg">
            <Group justify="space-between">
              <Badge>{item.category}</Badge>
              <Badge variant="outline">{item.status}</Badge>
            </Group>
            <Title order={3} mt="md">
              {item.name}
            </Title>
            <Text c="dimmed" lineClamp={3} mt="xs">
              {item.description}
            </Text>
            <Button
              component={Link}
              to={`${getLocalizedPath('memberGroups', locale)}/${item.id}`}
              variant="light"
              mt="lg"
            >
              {copy.openGroup}
            </Button>
          </Paper>
        ))}
      </SimpleGrid>
      {groups.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
      <Modal opened={opened} onClose={() => setOpened(false)} title={copy.createGroup}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            run(async () => {
              await saveGroup(
                access,
                {
                  id: '',
                  name,
                  description,
                  category: category as PortalGroup['category'],
                  status: 'active',
                  visibility: visibility as PortalGroup['visibility'],
                  contactUid: access.uid,
                  contactDisplayName: access.displayName,
                },
                access
              );
              await reload();
              setOpened(false);
            });
          }}
        >
          <Stack>
            <TextInput
              label={copy.groupName}
              required
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
            <Textarea
              label={copy.descriptionLabel}
              value={description}
              onChange={(event) => setDescription(event.currentTarget.value)}
            />
            <Select
              label={copy.category}
              value={category}
              onChange={(value) => setCategory(value || 'other')}
              data={[
                'staff',
                'leadership',
                'elders',
                'deacons',
                'worship',
                'volunteer',
                'smallGroup',
                'eventTeam',
                'committee',
                'ministry',
                'other',
              ]}
            />
            <Select
              label={copy.visibility}
              value={visibility}
              onChange={(value) => setVisibility(value || 'groupMembers')}
              data={['allApproved', 'groupMembers', 'adminOnly']}
            />
            <Button type="submit" loading={busy}>
              {copy.create}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}

function GroupPanel({
  copy,
  access,
  busy,
  run,
}: {
  copy: typeof copyByLocale.en;
  access: MemberAccess;
  locale: 'en' | 'es';
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
}) {
  const { groupId = '' } = useParams();
  const [portalGroup, setPortalGroup] = useState<PortalGroup | null>(null);
  const [membership, setMembership] = useState<GroupMembership | null>(null);
  const [members, setMembers] = useState<GroupMembership[]>([]);
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [updates, setUpdates] = useState<GroupUpdate[]>([]);
  const reload = async () => {
    const group = await loadGroup(groupId);
    setPortalGroup(group);
    if (!group) {
      return;
    }
    const [mine, groupMembers] = await Promise.all([
      loadGroupMembership(groupId, access.uid),
      loadGroupMembers(groupId),
    ]);
    setMembership(mine);
    setMembers(groupMembers);
    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    const to = new Date();
    to.setFullYear(to.getFullYear() + 1);
    setEvents(await loadEvents([groupId], from, to));
    setUpdates(await loadUpdates([groupId]));
  };
  useEffect(() => {
    reload();
  }, [groupId]);
  if (!portalGroup) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }
  const roles = membership?.roles ?? [];
  const canManage =
    access.role === 'admin' || roles.includes('owner') || roles.includes('groupAdmin');
  const canArchive = access.role === 'admin' || roles.includes('owner');
  const canEvents = canManage || roles.includes('calendarManager');
  const canUpdates = canManage || roles.includes('editor');
  return (
    <Stack>
      <Paper withBorder p="xl">
        <Group justify="space-between" align="flex-start">
          <div>
            <Badge>{portalGroup.category}</Badge>
            <Title order={2} mt="sm">
              {portalGroup.name}
            </Title>
            <Text c="dimmed" mt="sm">
              {portalGroup.description}
            </Text>
            {portalGroup.contactDisplayName ? (
              <Text mt="md">{portalGroup.contactDisplayName}</Text>
            ) : null}
          </div>
          {canArchive && portalGroup.status !== 'archived' ? (
            <Button
              color="red"
              variant="light"
              onClick={() => {
                if (window.confirm(copy.archive)) {
                  run(async () => {
                    await saveGroup(access, { ...portalGroup, status: 'archived' });
                    await reload();
                  });
                }
              }}
            >
              {copy.archive}
            </Button>
          ) : null}
        </Group>
      </Paper>
      {canManage ? (
        <GroupSettings
          copy={copy}
          access={access}
          group={portalGroup}
          canChangeStatus={canArchive}
          busy={busy}
          run={run}
          reload={reload}
        />
      ) : null}
      {canManage ? (
        <MembershipManager {...{ copy, access, portalGroup, members, busy, run, reload }} />
      ) : (
        <Paper withBorder p="lg">
          <Title order={3}>{copy.members}</Title>
          <Text mt="sm">{members.map((item) => item.displayName).join(', ') || copy.empty}</Text>
        </Paper>
      )}
      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <EventList
          copy={copy}
          events={events}
          canEdit={canEvents}
          group={portalGroup}
          access={access}
          busy={busy}
          run={run}
          reload={reload}
        />
        <UpdateList
          copy={copy}
          updates={updates}
          canEdit={canUpdates}
          group={portalGroup}
          access={access}
          busy={busy}
          run={run}
          reload={reload}
        />
      </SimpleGrid>
    </Stack>
  );
}

function GroupSettings({
  copy,
  access,
  group: portalGroup,
  canChangeStatus,
  busy,
  run,
  reload,
}: {
  copy: typeof copyByLocale.en;
  access: MemberAccess;
  group: PortalGroup;
  canChangeStatus: boolean;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  reload: () => Promise<void>;
}) {
  const [name, setName] = useState(portalGroup.name);
  const [description, setDescription] = useState(portalGroup.description);
  const [visibility, setVisibility] = useState(portalGroup.visibility);
  const [status, setStatus] = useState(portalGroup.status);
  return (
    <Paper withBorder p="xl">
      <Title order={3}>{copy.groupSettings}</Title>
      <SimpleGrid cols={{ base: 1, md: 2 }} mt="md">
        <TextInput
          label={copy.groupName}
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <Select
          label={copy.visibility}
          value={visibility}
          onChange={(value) =>
            setVisibility((value || 'groupMembers') as PortalGroup['visibility'])
          }
          data={['allApproved', 'groupMembers', 'adminOnly']}
        />
        <Textarea
          label={copy.descriptionLabel}
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        {canChangeStatus ? (
          <Select
            label={copy.statusLabel}
            value={status}
            onChange={(value) => setStatus((value || 'active') as PortalGroup['status'])}
            data={['draft', 'active', 'hidden', 'archived']}
          />
        ) : null}
      </SimpleGrid>
      <Button
        mt="lg"
        loading={busy}
        onClick={() =>
          run(async () => {
            await saveGroup(access, {
              ...portalGroup,
              name,
              description,
              visibility,
              status,
            });
            await reload();
          })
        }
      >
        {copy.save}
      </Button>
    </Paper>
  );
}

function MembershipManager({
  copy,
  access,
  portalGroup,
  members,
  busy,
  run,
  reload,
}: {
  copy: typeof copyByLocale.en;
  access: MemberAccess;
  portalGroup: PortalGroup;
  members: GroupMembership[];
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  reload: () => Promise<void>;
}) {
  const [approved, setApproved] = useState<MemberAccess[]>([]);
  const [memberUid, setMemberUid] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    loadMembersByStatus('approved').then(setApproved);
  }, []);
  return (
    <Paper withBorder p="xl">
      <Title order={3}>{copy.members}</Title>
      <Stack mt="md">
        {members.map((item) => (
          <MemberRoleEditor
            key={item.uid}
            member={item}
            copy={copy}
            access={access}
            group={portalGroup}
            busy={busy}
            run={run}
            reload={reload}
          />
        ))}
        <Divider />
        <Select
          searchable
          label={copy.addMember}
          value={memberUid}
          onChange={setMemberUid}
          data={approved
            .filter((item) => !members.some((existing) => existing.uid === item.uid))
            .map((item) => ({ value: item.uid, label: item.displayName }))}
        />
        <MultiSelect
          label={copy.roles}
          value={roles}
          onChange={setRoles}
          data={[
            'leader',
            'groupAdmin',
            'editor',
            'calendarManager',
            ...(access.role === 'admin' ? ['owner'] : []),
          ]}
        />
        <Button
          disabled={!memberUid}
          loading={busy}
          onClick={() => {
            const member = approved.find((item) => item.uid === memberUid);
            if (member) {
              run(async () => {
                await saveGroupMembership(access, portalGroup, member, roles as GroupRole[]);
                setMemberUid(null);
                setRoles([]);
                await reload();
              });
            }
          }}
        >
          {copy.add}
        </Button>
      </Stack>
    </Paper>
  );
}

function MemberRoleEditor({
  member,
  copy,
  access,
  group: portalGroup,
  busy,
  run,
  reload,
}: {
  member: GroupMembership;
  copy: typeof copyByLocale.en;
  access: MemberAccess;
  group: PortalGroup;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  reload: () => Promise<void>;
}) {
  const [roles, setRoles] = useState<string[]>(member.roles);
  const roleOptions = [
    'leader',
    'groupAdmin',
    'editor',
    'calendarManager',
    ...(access.role === 'admin' || member.roles.includes('owner') ? ['owner'] : []),
  ];
  return (
    <Group align="end" wrap="wrap">
      <Text fw={700} className={classes.memberName}>
        {member.displayName}
      </Text>
      <MultiSelect
        aria-label={`Roles for ${member.displayName}`}
        value={roles}
        onChange={setRoles}
        data={roleOptions}
        className={classes.roleSelect}
      />
      <Button
        size="xs"
        variant="light"
        loading={busy}
        onClick={() =>
          run(async () => {
            await saveGroupMembership(access, portalGroup, member, roles as GroupRole[]);
            await reload();
          })
        }
      >
        {copy.saveRoles}
      </Button>
      <Button
        size="xs"
        color="red"
        variant="subtle"
        disabled={member.uid === access.uid && member.roles.includes('owner')}
        loading={busy}
        onClick={() => {
          if (window.confirm(`Remove ${member.displayName} from ${portalGroup.name}?`)) {
            run(async () => {
              await removeGroupMembership(access, portalGroup, member.uid);
              await reload();
            });
          }
        }}
      >
        {copy.removeMember}
      </Button>
    </Group>
  );
}

function EventList({
  copy,
  events,
  canEdit,
  group: portalGroup,
  access,
  busy,
  run,
  reload,
}: {
  copy: typeof copyByLocale.en;
  events: GroupEvent[];
  canEdit: boolean;
  group: PortalGroup;
  access: MemberAccess;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  reload: () => Promise<void>;
}) {
  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [starts, setStarts] = useState(toInputDate(new Date()));
  const [ends, setEnds] = useState(toInputDate(new Date(Date.now() + 3600000)));
  const [allDay, setAllDay] = useState(false);
  return (
    <Paper withBorder p="xl">
      <Group justify="space-between">
        <Title order={3}>{copy.events}</Title>
        {canEdit ? (
          <Button size="xs" onClick={() => setOpened(true)}>
            {copy.newEvent}
          </Button>
        ) : null}
      </Group>
      <Stack mt="lg">
        {events.map((item) => (
          <Paper key={item.id} withBorder p="md">
            <Group justify="space-between">
              <Text fw={800}>{item.title}</Text>
              {item.status !== 'scheduled' ? <Badge color="red">{copy.canceled}</Badge> : null}
            </Group>
            <Text size="sm">
              {item.startsAt.toLocaleString()} · {item.location}
            </Text>
            <Button variant="subtle" size="xs" mt="xs" onClick={() => downloadIcs(item)}>
              {copy.addCalendar}
            </Button>
          </Paper>
        ))}
        {events.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
      </Stack>
      <Modal opened={opened} onClose={() => setOpened(false)} title={copy.newEvent}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            run(async () => {
              await saveEvent(access, {
                groupId: portalGroup.id,
                groupName: portalGroup.name,
                title,
                description,
                location,
                startsAt: new Date(starts),
                endsAt: new Date(ends),
                allDay,
                visibility: portalGroup.visibility,
                status: 'scheduled',
              });
              await reload();
              setOpened(false);
            });
          }}
        >
          <Stack>
            <TextInput
              label={copy.titleLabel}
              required
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
            <Textarea
              label={copy.descriptionLabel}
              value={description}
              onChange={(event) => setDescription(event.currentTarget.value)}
            />
            <TextInput
              label={copy.location}
              value={location}
              onChange={(event) => setLocation(event.currentTarget.value)}
            />
            <TextInput
              type="datetime-local"
              label={copy.starts}
              value={starts}
              onChange={(event) => setStarts(event.currentTarget.value)}
            />
            <TextInput
              type="datetime-local"
              label={copy.ends}
              value={ends}
              onChange={(event) => setEnds(event.currentTarget.value)}
            />
            <Checkbox
              label={copy.allDay}
              checked={allDay}
              onChange={(event) => setAllDay(event.currentTarget.checked)}
            />
            <Button type="submit" loading={busy}>
              {copy.publishEvent}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Paper>
  );
}

function UpdateList({
  copy,
  updates,
  canEdit,
  group: portalGroup,
  access,
  busy,
  run,
  reload,
}: {
  copy: typeof copyByLocale.en;
  updates: GroupUpdate[];
  canEdit: boolean;
  group: PortalGroup;
  access: MemberAccess;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  reload: () => Promise<void>;
}) {
  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [important, setImportant] = useState(false);
  const [pinned, setPinned] = useState(false);
  return (
    <Paper withBorder p="xl">
      <Group justify="space-between">
        <Title order={3}>{copy.announcements}</Title>
        {canEdit ? (
          <Button size="xs" onClick={() => setOpened(true)}>
            {copy.newUpdate}
          </Button>
        ) : null}
      </Group>
      <Stack mt="lg">
        {updates.map((item) => (
          <Paper key={item.id} withBorder p="md">
            <Group>
              {item.important ? <Badge color="red">{copy.important}</Badge> : null}
              {item.pinned ? <Badge>{copy.pinned}</Badge> : null}
            </Group>
            <Text fw={800} mt="xs">
              {item.title}
            </Text>
            <Text className={classes.preserveLines} mt="xs">
              {item.body}
            </Text>
          </Paper>
        ))}
        {updates.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
      </Stack>
      <Modal opened={opened} onClose={() => setOpened(false)} title={copy.newUpdate}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            run(async () => {
              await saveUpdate(access, {
                groupId: portalGroup.id,
                groupName: portalGroup.name,
                title,
                body,
                visibility: portalGroup.visibility,
                status: 'published',
                pinned,
                important,
              });
              await reload();
              setOpened(false);
            });
          }}
        >
          <Stack>
            <TextInput
              label={copy.titleLabel}
              required
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
            <Textarea
              label={copy.body}
              minRows={5}
              value={body}
              onChange={(event) => setBody(event.currentTarget.value)}
            />
            <Checkbox
              label={copy.important}
              checked={important}
              onChange={(event) => setImportant(event.currentTarget.checked)}
            />
            <Checkbox
              label={copy.pinned}
              checked={pinned}
              onChange={(event) => setPinned(event.currentTarget.checked)}
            />
            <Button type="submit" loading={busy}>
              {copy.publish}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Paper>
  );
}

function CalendarPanel({ copy, access }: { copy: typeof copyByLocale.en; access: MemberAccess }) {
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const range = useMemo(() => {
    const from = new Date();
    from.setDate(1);
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setMonth(to.getMonth() + 3);
    return { from, to };
  }, []);
  useEffect(() => {
    loadMyGroups(access.uid)
      .then((groups) =>
        loadEvents(
          groups.map((item) => item.id),
          range.from,
          range.to
        )
      )
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [access.uid]);
  return (
    <Paper withBorder p="xl">
      <Title order={2}>{copy.calendar}</Title>
      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : (
        <Stack mt="lg">
          {events.map((event) => (
            <Paper key={event.id} withBorder p="lg">
              <Group justify="space-between">
                <div>
                  <Text fw={800}>{event.title}</Text>
                  <Text size="sm" c="dimmed">
                    {event.groupName} · {event.startsAt.toLocaleString()}
                  </Text>
                  <Text size="sm">{event.location}</Text>
                </div>
                <Button variant="light" onClick={() => downloadIcs(event)}>
                  {copy.addCalendar}
                </Button>
              </Group>
            </Paper>
          ))}
          {events.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
        </Stack>
      )}
    </Paper>
  );
}

function UpdatesPanel({ copy, access }: { copy: typeof copyByLocale.en; access: MemberAccess }) {
  const [updates, setUpdates] = useState<GroupUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadMyGroups(access.uid)
      .then((groups) => loadUpdates(groups.map((item) => item.id)))
      .then(setUpdates)
      .finally(() => setLoading(false));
  }, [access.uid]);
  return (
    <Paper withBorder p="xl">
      <Title order={2}>{copy.updates}</Title>
      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : (
        <Stack mt="lg">
          {updates.map((item) => (
            <Paper key={item.id} withBorder p="lg">
              <Group>
                <Badge>{item.groupName}</Badge>
                {item.important ? <Badge color="red">{copy.important}</Badge> : null}
                {item.pinned ? <Badge variant="light">{copy.pinned}</Badge> : null}
              </Group>
              <Title order={3} mt="sm">
                {item.title}
              </Title>
              <Text className={classes.preserveLines} mt="sm">
                {item.body}
              </Text>
            </Paper>
          ))}
          {updates.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
        </Stack>
      )}
    </Paper>
  );
}

function AdminPanel({
  copy,
  access,
  busy,
  run,
}: {
  copy: typeof copyByLocale.en;
  access: MemberAccess;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
}) {
  const statuses: MemberStatus[] = [
    'pending',
    'approved',
    'rejected',
    'deactivated',
    'banned',
    'deletionRequested',
    'deleted',
  ];
  const [status, setStatus] = useState<MemberStatus>('pending');
  const [members, setMembers] = useState<MemberAccess[]>([]);
  const [photos, setPhotos] = useState<AvatarMetadata[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [tab, setTab] = useState<string>('members');
  const reload = async () => {
    setMembers(await loadMembersByStatus(status));
    if (tab === 'photos') {
      setPhotos(await loadAvatarModeration());
    }
    if (tab === 'audit') {
      setAudits(await loadAuditLogs());
    }
  };
  useEffect(() => {
    reload();
  }, [status, tab]);
  return (
    <Stack>
      <Title order={2}>{copy.admin}</Title>
      <Text c="dimmed">{copy.adminHelp}</Text>
      <Tabs value={tab} onChange={(value) => setTab(value || 'members')}>
        <Tabs.List>
          <Tabs.Tab value="members">{copy.members}</Tabs.Tab>
          <Tabs.Tab value="photos">{copy.photos}</Tabs.Tab>
          <Tabs.Tab value="audit">{copy.audit}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="members" pt="lg">
          <Group mb="lg">
            {statuses.map((item) => (
              <Button
                key={item}
                size="xs"
                variant={status === item ? 'filled' : 'light'}
                onClick={() => setStatus(item)}
              >
                {item}
              </Button>
            ))}
          </Group>
          <Stack>
            {members.map((member) => (
              <AdminMemberCard key={member.uid} {...{ copy, access, member, busy, run, reload }} />
            ))}
            {members.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="photos" pt="lg">
          <Stack>
            {photos.map((photo) => (
              <Paper key={photo.uid} withBorder p="lg">
                <Group justify="space-between">
                  <Group>
                    <PendingAvatar uid={photo.uid} />
                    <Text fw={700}>{photo.uid}</Text>
                  </Group>
                  <Group>
                    <Button
                      loading={busy}
                      onClick={() =>
                        run(async () => {
                          await moderateAvatar(photo.uid, 'approve');
                          await reload();
                        })
                      }
                    >
                      {copy.approvePhoto}
                    </Button>
                    <Button
                      color="red"
                      variant="light"
                      loading={busy}
                      onClick={() =>
                        run(async () => {
                          await moderateAvatar(photo.uid, 'reject');
                          await reload();
                        })
                      }
                    >
                      {copy.rejectPhoto}
                    </Button>
                  </Group>
                </Group>
              </Paper>
            ))}
            {photos.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="audit" pt="lg">
          <Stack>
            {audits.map((audit) => (
              <Paper key={audit.id} withBorder p="md">
                <Group justify="space-between">
                  <Text fw={700}>{audit.action}</Text>
                  <Text size="xs" c="dimmed">
                    {audit.createdAt?.toLocaleString()}
                  </Text>
                </Group>
                <Text size="sm">
                  {audit.actorDisplayName} · {audit.summary}
                </Text>
              </Paper>
            ))}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

function AdminMemberCard({
  copy,
  access,
  member,
  busy,
  run,
  reload,
}: {
  copy: typeof copyByLocale.en;
  access: MemberAccess;
  member: MemberAccess;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  reload: () => Promise<void>;
}) {
  const action = (next: MemberStatus, label: string) => (
    <Button
      size="xs"
      color={next === 'approved' || next === 'deactivated' ? 'green' : 'red'}
      variant={next === 'approved' ? 'filled' : 'light'}
      disabled={member.uid === access.uid}
      loading={busy}
      onClick={() => {
        if (next === 'approved' || window.confirm(`${label}: ${member.displayName}?`)) {
          run(async () => {
            await changeMemberStatus(access, member, next);
            await reload();
          });
        }
      }}
    >
      {label}
    </Button>
  );
  return (
    <Paper withBorder p="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Text fw={800}>{member.displayName}</Text>
          <Text size="sm" c="dimmed">
            {member.email}
          </Text>
          <Group mt="xs">
            <Badge>{member.status}</Badge>
            <Badge variant="outline">{member.role}</Badge>
          </Group>
        </div>
        <Group>
          {member.status === 'pending' ? (
            <>
              {action('approved', copy.approve)}
              {action('rejected', copy.reject)}
            </>
          ) : null}
          {member.status === 'approved' ? (
            <>
              {action('deactivated', copy.deactivate)}
              {action('banned', copy.ban)}
              <Button
                size="xs"
                variant="light"
                disabled={member.uid === access.uid}
                onClick={() =>
                  run(async () => {
                    await changeMemberRole(
                      access,
                      member,
                      member.role === 'admin' ? 'member' : 'admin'
                    );
                    await reload();
                  })
                }
              >
                {member.role === 'admin' ? copy.removeAdmin : copy.makeAdmin}
              </Button>
            </>
          ) : null}
          {member.status === 'rejected' ? action('approved', copy.approve) : null}
          {member.status === 'deactivated' ? (
            <>
              {action('approved', copy.reactivate)}
              {action('banned', copy.ban)}
            </>
          ) : null}
          {member.status === 'banned' ? action('deactivated', copy.unban) : null}
          {member.status === 'deletionRequested' ? (
            <Button
              color="red"
              size="xs"
              loading={busy}
              onClick={() => {
                if (window.confirm(`${copy.processDeletion}: ${member.displayName}?`)) {
                  run(async () => {
                    await removeMemberAvatar(member.uid).catch(() => undefined);
                    await processDeletion(access, member);
                    await reload();
                  });
                }
              }}
            >
              {copy.processDeletion}
            </Button>
          ) : null}
        </Group>
      </Group>
      {member.status === 'approved' ? (
        <>
          <AdminProfileEditor copy={copy} actor={access} member={member} busy={busy} run={run} />
          <AdminPhotoUpload copy={copy} uid={member.uid} busy={busy} run={run} />
        </>
      ) : null}
    </Paper>
  );
}

function AdminProfileEditor({
  copy,
  actor,
  member,
  busy,
  run,
}: {
  copy: typeof copyByLocale.en;
  actor: MemberAccess;
  member: MemberAccess;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
}) {
  const [opened, setOpened] = useState(false);
  const [profile, setProfile] = useState<DirectoryProfile | null>(null);
  const open = async () => {
    setProfile((await loadOwnProfile(member.uid)) ?? emptyProfile(member.uid, member.email));
    setOpened(true);
  };
  const update = (next: Partial<DirectoryProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...next });
    }
  };
  const visibility = (key: keyof DirectoryProfile['visibility'], checked: boolean) => {
    if (profile) {
      update({ visibility: { ...profile.visibility, [key]: checked } });
    }
  };
  return (
    <>
      <Button variant="subtle" size="xs" mt="md" onClick={open}>
        {copy.editProfile}
      </Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title={copy.editProfile}>
        {profile ? (
          <Stack>
            <TextInput
              label={copy.displayName}
              value={profile.displayName}
              onChange={(event) => update({ displayName: event.currentTarget.value })}
            />
            <TextInput
              label={copy.preferredName}
              value={profile.preferredName}
              onChange={(event) => update({ preferredName: event.currentTarget.value })}
            />
            <TextInput
              label={copy.phone}
              value={profile.phone}
              onChange={(event) => update({ phone: event.currentTarget.value })}
            />
            <TextInput
              label={copy.pronouns}
              value={profile.pronouns}
              onChange={(event) => update({ pronouns: event.currentTarget.value })}
            />
            <TextInput
              label={copy.household}
              value={profile.household}
              onChange={(event) => update({ household: event.currentTarget.value })}
            />
            <Textarea
              label={copy.interests}
              value={profile.ministryInterests}
              onChange={(event) => update({ ministryInterests: event.currentTarget.value })}
            />
            <Switch
              label={copy.directoryListed}
              checked={profile.visibility.listed}
              onChange={(event) => visibility('listed', event.currentTarget.checked)}
            />
            <Group>
              <Checkbox
                label={copy.showEmail}
                checked={profile.visibility.email}
                onChange={(event) => visibility('email', event.currentTarget.checked)}
              />
              <Checkbox
                label={copy.showPhone}
                checked={profile.visibility.phone}
                onChange={(event) => visibility('phone', event.currentTarget.checked)}
              />
              <Checkbox
                label={copy.showPhoto}
                checked={profile.visibility.photo}
                onChange={(event) => visibility('photo', event.currentTarget.checked)}
              />
            </Group>
            <Button
              loading={busy}
              onClick={() =>
                run(async () => {
                  await saveMemberProfile(actor, profile);
                  setOpened(false);
                })
              }
            >
              {copy.save}
            </Button>
          </Stack>
        ) : (
          <Center py="xl">
            <Loader />
          </Center>
        )}
      </Modal>
    </>
  );
}

function AdminPhotoUpload({
  copy,
  uid,
  busy,
  run,
}: {
  copy: typeof copyByLocale.en;
  uid: string;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  return (
    <Group align="end" mt="lg">
      <FileInput
        accept="image/jpeg,image/png,image/webp"
        label={copy.adminUpload}
        value={file}
        onChange={setFile}
      />
      <Checkbox
        label={copy.consent}
        checked={consent}
        onChange={(event) => setConsent(event.currentTarget.checked)}
      />
      <Button
        size="xs"
        disabled={!file || !consent}
        loading={busy}
        onClick={() =>
          file &&
          run(async () => {
            await uploadMemberAvatar(uid, await prepareAvatar(file));
            setFile(null);
            setConsent(false);
          })
        }
      >
        {copy.uploadPhoto}
      </Button>
      <Button
        size="xs"
        color="red"
        variant="light"
        loading={busy}
        onClick={() =>
          run(async () => {
            await removeMemberAvatar(uid);
          })
        }
      >
        {copy.removePhoto}
      </Button>
    </Group>
  );
}

function PendingAvatar({ uid }: { uid: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    fetchAvatar(uid, 'pending').then(setUrl);
  }, [uid]);
  return <Avatar src={url} name={uid} />;
}

function GivingPanel({ copy, locale }: { copy: typeof copyByLocale.en; locale: 'en' | 'es' }) {
  return (
    <Paper withBorder p="xl">
      <Title order={2}>{copy.giving}</Title>
      <Text c="dimmed" mt="sm">
        {copy.givingHelp}
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

function toInputDate(date: Date) {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 16);
}
function downloadIcs(event: GroupEvent) {
  const url = URL.createObjectURL(
    new Blob([createIcs(event)], { type: 'text/calendar;charset=utf-8' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'event'}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
