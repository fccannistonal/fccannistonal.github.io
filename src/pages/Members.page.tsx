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
  IconRefresh,
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
  Box,
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
import { notifyMemberAccessRequest } from '../lib/formConfig';
import { useLocale } from '../lib/i18n';
import {
  changeMemberRole,
  changeMemberStatus,
  completeEmailLinkSignIn,
  createIcs,
  deleteCurrentAuthAccount,
  ensureMemberOnboardingAccount,
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
  requestMemberAreaAccess,
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
  type MemberConnection,
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
    title: 'Member area',
    description:
      'Private profiles and trusted community resources for approved members and participants of First Christian Church Anniston.',
    setupTitle: 'Member area setup is pending',
    missing: 'Missing configuration:',
    signIn: 'Create or sign in to your account',
    signInHelp:
      'We will email you a secure link. First-time users can set up a private profile before requesting member area access.',
    confirmEmail: 'Confirm your email to finish signing in',
    confirmEmailHelp:
      'This link was opened in a different browser or device. Enter the same email address that received the link.',
    finishSignIn: 'Finish signing in',
    linkProblem: 'This sign-in link is invalid or has expired. Request a new secure link below.',
    signInComplete: 'You are signed in.',
    email: 'Email address',
    sendLink: 'Send sign-in link',
    linkSent: 'Check your email for the secure sign-in link.',
    request: 'Request member area access',
    requestHelp:
      'When your private profile is ready, tell church staff how you are connected to the congregation.',
    connection: 'Connection to the congregation',
    connectionRequired: 'Choose the option that best describes your connection.',
    connectionChurchMember: 'I am a church member',
    connectionRegularParticipant: 'I regularly attend or participate',
    connectionHousehold: 'I am part of a member or participant household',
    connectionMinistry: 'I volunteer or participate in a ministry',
    connectionOther: 'Something else',
    requestNote: 'Anything else staff should know?',
    requestNoteHelp:
      'Optional. Do not include prayer requests or pastoral, medical, financial, or other sensitive information.',
    requestNameHelp: 'Add your full name above before requesting access.',
    displayName: 'Full name',
    submitRequest: 'Submit request',
    pending: 'Your member area access request is waiting for staff review.',
    pendingHelp:
      'You can continue updating your private profile. Directory, groups, calendar, updates, photos, and member resources remain locked until approval.',
    checkStatus: 'Check access status',
    onboarding: 'Private profile setup',
    onboardingHelp:
      'Only you and authorized church staff can see these details while you set up your account.',
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
    unsaved: 'You have unsaved changes',
    error: 'Something went wrong. Please try again.',
    loading: 'Loading member area',
    empty: 'Nothing to show yet.',
    loadMore: 'Load more',
    preferredName: 'Preferred name',
    preferredNameHelp: 'The name you would like people to use.',
    phone: 'Phone',
    pronouns: 'Pronouns',
    household: 'Household or family',
    interests: 'Ministry interests',
    interestsHelp: 'Share the ministries, service opportunities, or groups you care about.',
    profileHeading: 'Your profile',
    profileIntro:
      'Keep your contact details current and choose exactly what other members can see.',
    restrictedProfileIntro:
      'Set up the private details church staff can use to identify and contact you.',
    personalDetails: 'Personal details',
    personalDetailsHelp: 'This information helps church staff identify and contact you.',
    privateEmailHelp: 'Your sign-in email is managed by your account and cannot be edited here.',
    privacyHeading: 'Directory privacy',
    privacyHelp: 'You are in control. Nothing appears in the directory until you opt in.',
    directoryOnHelp: 'Your profile is visible to approved members. Choose the details to include.',
    directoryOffHelp: 'Your profile is private and will not appear in the member directory.',
    sharedDetails: 'Details visible to members',
    noSharedDetails: 'No contact details selected yet.',
    directoryListed: 'Include me in the member directory',
    showEmail: 'Show my email',
    showPhone: 'Show my phone',
    showPronouns: 'Show my pronouns',
    showHousehold: 'Show my household',
    showPhoto: 'Show my approved photo',
    photo: 'Profile photo',
    photoHelp: 'Photos are cropped to a small square WebP and require administrator approval.',
    choosePhoto: 'Choose a new photo',
    photoFormats: 'JPG, PNG, or WebP. Choose a clear, square image for the best result.',
    uploadPhoto: 'Upload photo',
    replacePhoto: 'Save new photo',
    removePhoto: 'Remove photo',
    removePhotoTitle: 'Remove your profile photo?',
    removePhotoHelp: 'Your current photo will no longer be available in the member directory.',
    cancel: 'Cancel',
    pendingPhoto: 'Your new photo is pending approval.',
    accountOptions: 'Account options',
    accountOptionsHelp: 'Access account-specific controls, including requesting profile deletion.',
    deletionTitle: 'Request profile deletion',
    deletionHelp:
      'This immediately blocks portal access while an administrator removes your profile and photo.',
    requestDeletion: 'Request deletion',
    confirmDeletion: 'Request deletion of your member profile?',
    deletionModalHelp:
      'This request signs you out of the member area and blocks access while an administrator removes your profile and photo. This cannot be undone here.',
    confirmationLabel: 'Type DELETE to confirm',
    confirmationHelp: 'Enter DELETE exactly as shown.',
    deletePhrase: 'DELETE',
    deleteAuth: 'Delete my sign-in account',
    memberResources: 'Member resources',
    givingDescription: 'View options for requesting or accessing your giving statements.',
    openGiving: 'View giving statements',
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
    reviewRequest: 'Review request',
    requestDetails: 'Access request details',
    noRequestNote: 'No additional note provided.',
    rejectReason: 'Reason shown to the requester',
    rejectReasonHelp: 'A reason is required before rejecting access.',
    approveRequest: 'Approve member area access',
    rejectRequest: 'Reject access request',
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
    title: 'Área de miembros',
    description:
      'Perfiles privados y recursos comunitarios para miembros y participantes aprobados de la Primera Iglesia Cristiana de Anniston.',
    setupTitle: 'La configuración del área de miembros está pendiente',
    missing: 'Falta configuración:',
    signIn: 'Crear una cuenta o iniciar sesión',
    signInHelp:
      'Le enviaremos un enlace seguro. Las personas nuevas pueden configurar un perfil privado antes de solicitar acceso al área de miembros.',
    confirmEmail: 'Confirme su correo para terminar de iniciar sesión',
    confirmEmailHelp:
      'Este enlace se abrió en otro navegador o dispositivo. Ingrese el mismo correo que recibió el enlace.',
    finishSignIn: 'Terminar de iniciar sesión',
    linkProblem: 'Este enlace no es válido o venció. Solicite otro enlace seguro abajo.',
    signInComplete: 'Ha iniciado sesión.',
    email: 'Correo electrónico',
    sendLink: 'Enviar enlace',
    linkSent: 'Revise su correo para abrir el enlace seguro.',
    request: 'Solicitar acceso al área de miembros',
    requestHelp:
      'Cuando su perfil privado esté listo, informe al personal cómo se relaciona con la congregación.',
    connection: 'Relación con la congregación',
    connectionRequired: 'Elija la opción que mejor describe su relación.',
    connectionChurchMember: 'Soy miembro de la iglesia',
    connectionRegularParticipant: 'Asisto o participo regularmente',
    connectionHousehold: 'Formo parte del hogar de un miembro o participante',
    connectionMinistry: 'Soy voluntario o participo en un ministerio',
    connectionOther: 'Otra relación',
    requestNote: '¿Hay algo más que el personal deba saber?',
    requestNoteHelp:
      'Opcional. No incluya peticiones de oración ni información pastoral, médica, financiera u otra información sensible.',
    requestNameHelp: 'Agregue su nombre completo arriba antes de solicitar acceso.',
    displayName: 'Nombre completo',
    submitRequest: 'Enviar solicitud',
    pending: 'Su solicitud de acceso al área de miembros espera revisión del personal.',
    pendingHelp:
      'Puede seguir actualizando su perfil privado. El directorio, los grupos, el calendario, las novedades, las fotos y los recursos permanecen bloqueados hasta la aprobación.',
    checkStatus: 'Comprobar estado de acceso',
    onboarding: 'Configuración del perfil privado',
    onboardingHelp:
      'Solo usted y el personal autorizado de la iglesia pueden ver estos datos mientras configura su cuenta.',
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
    unsaved: 'Tiene cambios sin guardar',
    error: 'Algo salió mal. Inténtelo de nuevo.',
    loading: 'Cargando el área de miembros',
    empty: 'No hay contenido todavía.',
    loadMore: 'Cargar más',
    preferredName: 'Nombre preferido',
    preferredNameHelp: 'El nombre que desea que usen los demás.',
    phone: 'Teléfono',
    pronouns: 'Pronombres',
    household: 'Hogar o familia',
    interests: 'Intereses ministeriales',
    interestsHelp: 'Comparta los ministerios, oportunidades de servicio o grupos que le interesan.',
    profileHeading: 'Su perfil',
    profileIntro:
      'Mantenga sus datos de contacto al día y elija exactamente qué pueden ver los demás miembros.',
    restrictedProfileIntro:
      'Configure los datos privados que el personal puede usar para identificarle y contactarle.',
    personalDetails: 'Datos personales',
    personalDetailsHelp:
      'Esta información ayuda al personal de la iglesia a identificarle y contactarle.',
    privateEmailHelp: 'El correo de acceso pertenece a su cuenta y no se puede editar aquí.',
    privacyHeading: 'Privacidad del directorio',
    privacyHelp: 'Usted tiene el control. Nada aparece en el directorio hasta que lo autorice.',
    directoryOnHelp:
      'Su perfil es visible para miembros aprobados. Elija los datos que desea incluir.',
    directoryOffHelp: 'Su perfil es privado y no aparecerá en el directorio de miembros.',
    sharedDetails: 'Datos visibles para miembros',
    noSharedDetails: 'Aún no ha seleccionado datos de contacto.',
    directoryListed: 'Incluirme en el directorio',
    showEmail: 'Mostrar mi correo',
    showPhone: 'Mostrar mi teléfono',
    showPronouns: 'Mostrar mis pronombres',
    showHousehold: 'Mostrar mi hogar',
    showPhoto: 'Mostrar mi foto aprobada',
    photo: 'Foto de perfil',
    photoHelp: 'Las fotos se recortan a un WebP cuadrado pequeño y requieren aprobación.',
    choosePhoto: 'Elegir una foto nueva',
    photoFormats: 'JPG, PNG o WebP. Elija una imagen clara y cuadrada para un mejor resultado.',
    uploadPhoto: 'Subir foto',
    replacePhoto: 'Guardar foto nueva',
    removePhoto: 'Quitar foto',
    removePhotoTitle: '¿Quitar su foto de perfil?',
    removePhotoHelp: 'Su foto actual dejará de estar disponible en el directorio de miembros.',
    cancel: 'Cancelar',
    pendingPhoto: 'Su foto nueva espera aprobación.',
    accountOptions: 'Opciones de la cuenta',
    accountOptionsHelp:
      'Acceda a controles específicos de la cuenta, incluida la solicitud de eliminación del perfil.',
    deletionTitle: 'Solicitar eliminación del perfil',
    deletionHelp: 'Esto bloquea el acceso mientras un administrador elimina su perfil y foto.',
    requestDeletion: 'Solicitar eliminación',
    confirmDeletion: '¿Solicitar la eliminación de su perfil?',
    deletionModalHelp:
      'Esta solicitud cierra su sesión en el área de miembros y bloquea el acceso mientras un administrador elimina su perfil y foto. No se puede deshacer desde aquí.',
    confirmationLabel: 'Escriba ELIMINAR para confirmar',
    confirmationHelp: 'Escriba ELIMINAR exactamente como aparece.',
    deletePhrase: 'ELIMINAR',
    deleteAuth: 'Eliminar mi cuenta de acceso',
    memberResources: 'Recursos para miembros',
    givingDescription: 'Consulte cómo solicitar o acceder a sus comprobantes de donaciones.',
    openGiving: 'Ver comprobantes',
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
    reviewRequest: 'Revisar solicitud',
    requestDetails: 'Detalles de la solicitud de acceso',
    noRequestNote: 'No se proporcionó una nota adicional.',
    rejectReason: 'Motivo que verá la persona solicitante',
    rejectReasonHelp: 'Se requiere un motivo antes de rechazar el acceso.',
    approveRequest: 'Aprobar acceso al área de miembros',
    rejectRequest: 'Rechazar solicitud de acceso',
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

const connectionOptions = (copy: typeof copyByLocale.en) => [
  { value: 'churchMember', label: copy.connectionChurchMember },
  { value: 'regularParticipant', label: copy.connectionRegularParticipant },
  { value: 'householdOrFamily', label: copy.connectionHousehold },
  { value: 'ministryOrVolunteer', label: copy.connectionMinistry },
  { value: 'other', label: copy.connectionOther },
];

const connectionLabel = (copy: typeof copyByLocale.en, connection?: MemberConnection) =>
  connectionOptions(copy).find((option) => option.value === connection)?.label ?? copy.empty;

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
  const [accountReady, setAccountReady] = useState(false);
  const [linkRequiresEmail, setLinkRequiresEmail] = useState(false);
  const [linkProblem, setLinkProblem] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const configured = isMemberPortalConfigured();

  const refresh = async (currentUser = user, forceRefresh = false) => {
    if (!currentUser) {
      return;
    }
    let nextAccess = await loadMemberAccess(currentUser.uid, forceRefresh);
    if (!nextAccess) {
      nextAccess = await ensureMemberOnboardingAccount(currentUser);
    }
    const nextProfile = await loadOwnProfile(currentUser.uid, forceRefresh);
    setAccess(nextAccess);
    const resolved = nextProfile ?? emptyProfile(currentUser.uid, currentUser.email ?? '');
    setProfile(resolved);
    if (nextAccess?.status === 'approved' && nextProfile) {
      await migrateLegacyDirectoryEntry(nextProfile);
    }
    setAccountReady(true);
  };

  useEffect(() => {
    if (!configured) {
      return undefined;
    }
    completeEmailLinkSignIn(window.location.href)
      .then((result) => setLinkRequiresEmail(result === 'needs-email'))
      .catch(() => setLinkProblem(true));
    return subscribeToAuth((nextUser) => {
      setUser(nextUser ? { uid: nextUser.uid, email: nextUser.email } : null);
      setAuthReady(true);
      setAccountReady(!nextUser);
      if (!nextUser) {
        setAccess(null);
        setProfile(null);
      }
    });
  }, [configured, copy.error]);

  useEffect(() => {
    if (user) {
      refresh(user).catch(() => {
        setAccountReady(true);
        setNotice({ type: 'error', text: copy.error });
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user || !access || access.status === 'approved') {
      return undefined;
    }
    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') {
        refresh(user, true).catch(() => undefined);
      }
    };
    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnFocus);
    return () => {
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnFocus);
    };
  }, [user, access?.status]);

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
        {configured && authReady && !user ? (
          <SignIn
            copy={copy}
            busy={busy}
            run={run}
            linkRequiresEmail={linkRequiresEmail}
            linkProblem={linkProblem}
            completeLink={async (email) => {
              await completeEmailLinkSignIn(window.location.href, email);
              setLinkRequiresEmail(false);
              setLinkProblem(false);
            }}
          />
        ) : null}
        {configured && user && !accountReady ? (
          <Center py="xl">
            <Loader aria-label={copy.loading} />
          </Center>
        ) : null}
        {configured && user && accountReady ? (
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
            {access && ['onboarding', 'pending'].includes(access.status) && profile ? (
              <RestrictedProfileArea
                access={access}
                profile={profile}
                setProfile={setProfile}
                copy={copy}
                locale={locale}
                busy={busy}
                run={run}
                refresh={() => refresh(user, true)}
              />
            ) : null}
            {access && !['onboarding', 'pending', 'approved'].includes(access.status) ? (
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
  linkRequiresEmail,
  linkProblem,
  completeLink,
}: {
  copy: typeof copyByLocale.en;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  linkRequiresEmail: boolean;
  linkProblem: boolean;
  completeLink: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState('');
  return (
    <Paper withBorder p="xl">
      <Title order={2}>{linkRequiresEmail ? copy.confirmEmail : copy.signIn}</Title>
      <Text c="dimmed" mt="sm">
        {linkRequiresEmail ? copy.confirmEmailHelp : copy.signInHelp}
      </Text>
      {linkProblem ? (
        <Alert color="red" mt="lg">
          {copy.linkProblem}
        </Alert>
      ) : null}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (linkRequiresEmail) {
            run(() => completeLink(email), copy.signInComplete);
          } else {
            run(
              () =>
                sendMemberSignInLink(email, `${window.location.origin}${window.location.pathname}`),
              copy.linkSent
            );
          }
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
            {linkRequiresEmail ? copy.finishSignIn : copy.sendLink}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

function RestrictedProfileArea({
  access,
  profile,
  setProfile,
  copy,
  locale,
  busy,
  run,
  refresh,
}: {
  access: MemberAccess;
  profile: DirectoryProfile;
  setProfile: (profile: DirectoryProfile) => void;
  copy: typeof copyByLocale.en;
  locale: 'en' | 'es';
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  refresh: () => Promise<void>;
}) {
  const [connection, setConnection] = useState<MemberConnection | null>(access.connection ?? null);
  const [requestNote, setRequestNote] = useState(access.requestNote ?? '');
  const pending = access.status === 'pending';
  return (
    <Stack gap="lg">
      <Alert
        color={pending ? 'moss' : 'blue'}
        icon={pending ? <IconLock size={18} /> : <IconUser size={18} />}
        title={pending ? copy.pending : copy.onboarding}
      >
        <Text>{pending ? copy.pendingHelp : copy.onboardingHelp}</Text>
        {pending ? (
          <Button
            variant="light"
            mt="md"
            size="sm"
            loading={busy}
            leftSection={<IconRefresh size={17} />}
            onClick={() => run(refresh, copy.pending)}
          >
            {copy.checkStatus}
          </Button>
        ) : null}
      </Alert>
      <ProfilePanel
        key={access.status}
        profile={profile}
        setProfile={setProfile}
        copy={copy}
        busy={busy}
        run={run}
        refresh={refresh}
        access={access}
        restricted
      />
      {!pending ? (
        <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
          <Title order={2}>{copy.request}</Title>
          <Text c="dimmed" mt="sm" maw={720}>
            {copy.requestHelp}
          </Text>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!connection || !profile.displayName.trim()) {
                return;
              }
              run(async () => {
                await requestMemberAreaAccess(access, profile, connection, requestNote);
                void notifyMemberAccessRequest({
                  name: profile.displayName.trim(),
                  preferredName: profile.preferredName.trim(),
                  email: profile.email,
                  phone: profile.phone.trim(),
                  connection: connectionLabel(copy, connection),
                  note: requestNote.trim(),
                  locale,
                }).catch(() => undefined);
                await refresh();
              }, copy.pending);
            }}
          >
            <Stack mt="lg" gap="md">
              {!profile.displayName.trim() ? (
                <Alert color="moss" icon={<IconAlertCircle size={18} />}>
                  {copy.requestNameHelp}
                </Alert>
              ) : null}
              <Select
                label={copy.connection}
                description={copy.connectionRequired}
                data={connectionOptions(copy)}
                value={connection}
                required
                allowDeselect={false}
                onChange={(value) => setConnection(value as MemberConnection | null)}
              />
              <Textarea
                label={copy.requestNote}
                description={copy.requestNoteHelp}
                value={requestNote}
                maxLength={500}
                minRows={3}
                autosize
                onChange={(event) => setRequestNote(event.currentTarget.value)}
              />
              <Group justify="flex-end">
                <Button
                  type="submit"
                  loading={busy}
                  disabled={!connection || !profile.displayName.trim()}
                >
                  {copy.submitRequest}
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      ) : null}
    </Stack>
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
  restricted = false,
}: {
  profile: DirectoryProfile;
  setProfile: (profile: DirectoryProfile) => void;
  copy: typeof copyByLocale.en;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  refresh: () => Promise<void>;
  access: MemberAccess;
  restricted?: boolean;
}) {
  const [savedProfile, setSavedProfile] = useState(profile);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const update = (next: Partial<DirectoryProfile>) => setProfile({ ...profile, ...next });
  const visibility = (key: keyof DirectoryProfile['visibility'], value: boolean) =>
    update({ visibility: { ...profile.visibility, [key]: value } });
  const editableProfile = ({
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...value
  }: DirectoryProfile) => value;
  const hasChanges =
    JSON.stringify(editableProfile(profile)) !== JSON.stringify(editableProfile(savedProfile));
  const sharedDetails = [
    profile.visibility.email && copy.showEmail,
    profile.visibility.phone && copy.showPhone,
    profile.visibility.pronouns && copy.showPronouns,
    profile.visibility.household && copy.showHousehold,
    profile.visibility.photo && copy.showPhoto,
  ].filter(Boolean) as string[];

  const saveProfile = () =>
    run(async () => {
      await saveOwnProfile(profile, !restricted);
      const saved = restricted
        ? {
            ...profile,
            visibility: {
              listed: false,
              email: false,
              phone: false,
              pronouns: false,
              household: false,
              photo: false,
            },
          }
        : profile;
      setProfile(saved);
      setSavedProfile(saved);
      await refresh();
    });
  const closeDeleteModal = () => {
    setDeleteOpened(false);
    setDeleteConfirmation('');
  };

  return (
    <Stack gap="lg" className={classes.profileWorkspace}>
      <Paper className={classes.profileWelcome} p={{ base: 'lg', sm: 'xl' }}>
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="lg">
          <Box>
            <Text className={classes.sectionEyebrow}>{copy.profile}</Text>
            <Title order={2}>{copy.profileHeading}</Title>
            <Text c="dimmed" mt="xs" maw={620}>
              {restricted ? copy.restrictedProfileIntro : copy.profileIntro}
            </Text>
          </Box>
          {hasChanges ? (
            <Badge color="brand" variant="light" size="lg" className={classes.unsavedBadge}>
              {copy.unsaved}
            </Badge>
          ) : (
            <Badge
              color="green"
              variant="light"
              size="lg"
              leftSection={<IconCircleCheck size={14} />}
            >
              {copy.saved}
            </Badge>
          )}
        </Group>
      </Paper>

      <div className={restricted ? classes.profileGridSingle : classes.profileGrid}>
        <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.profileCard}>
          <div className={classes.cardHeader}>
            <Title order={3}>{copy.personalDetails}</Title>
            <Text c="dimmed" size="sm" mt={4}>
              {copy.personalDetailsHelp}
            </Text>
          </div>
          <form
            id="member-profile-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveProfile();
            }}
          >
            <Stack mt="xl" gap="lg">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label={copy.displayName}
                  value={profile.displayName}
                  required
                  maxLength={100}
                  autoComplete="name"
                  onChange={(event) => update({ displayName: event.currentTarget.value })}
                />
                <TextInput
                  label={copy.preferredName}
                  description={copy.preferredNameHelp}
                  value={profile.preferredName}
                  maxLength={100}
                  onChange={(event) => update({ preferredName: event.currentTarget.value })}
                />
              </SimpleGrid>
              <TextInput
                label={copy.email}
                description={copy.privateEmailHelp}
                value={profile.email}
                type="email"
                autoComplete="email"
                readOnly
                className={classes.readOnlyField}
              />
              <TextInput
                label={copy.phone}
                value={profile.phone}
                type="tel"
                autoComplete="tel"
                maxLength={40}
                onChange={(event) => update({ phone: event.currentTarget.value })}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label={copy.pronouns}
                  value={profile.pronouns}
                  maxLength={60}
                  onChange={(event) => update({ pronouns: event.currentTarget.value })}
                />
                <TextInput
                  label={copy.household}
                  value={profile.household}
                  autoComplete="organization"
                  maxLength={150}
                  onChange={(event) => update({ household: event.currentTarget.value })}
                />
              </SimpleGrid>
              <Textarea
                label={copy.interests}
                description={copy.interestsHelp}
                value={profile.ministryInterests}
                maxLength={500}
                minRows={3}
                autosize
                onChange={(event) => update({ ministryInterests: event.currentTarget.value })}
              />
            </Stack>
          </form>
        </Paper>

        {!restricted ? (
          <Stack gap="lg" className={classes.profileSidebar}>
            <AvatarPanel
              uid={profile.uid}
              name={profile.preferredName || profile.displayName}
              copy={copy}
              busy={busy}
              run={run}
            />
            <Paper withBorder p="lg" className={classes.resourceCard}>
              <Group wrap="nowrap" align="flex-start">
                <Box className={classes.resourceIcon} aria-hidden="true">
                  <IconFileText size={22} />
                </Box>
                <Box>
                  <Title order={3} size="h4">
                    {copy.memberResources}
                  </Title>
                  <Text c="dimmed" size="sm" mt={4}>
                    {copy.givingDescription}
                  </Text>
                  <Button
                    component={Link}
                    to={getLocalizedPath('memberGivingStatements', useLocale())}
                    variant="light"
                    mt="md"
                    size="sm"
                  >
                    {copy.openGiving}
                  </Button>
                </Box>
              </Group>
            </Paper>
          </Stack>
        ) : null}
      </div>

      {!restricted ? (
        <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.privacyCard}>
          <div className={classes.cardHeader}>
            <Title order={3}>{copy.privacyHeading}</Title>
            <Text c="dimmed" size="sm" mt={4}>
              {copy.privacyHelp}
            </Text>
          </div>
          <div
            className={classes.directoryToggle}
            data-enabled={profile.visibility.listed || undefined}
          >
            <Switch
              size="lg"
              label={copy.directoryListed}
              description={profile.visibility.listed ? copy.directoryOnHelp : copy.directoryOffHelp}
              checked={profile.visibility.listed}
              onChange={(event) => visibility('listed', event.currentTarget.checked)}
            />
          </div>
          {profile.visibility.listed ? (
            <Box className={classes.sharingOptions}>
              <Text fw={700} size="sm" mb="sm">
                {copy.sharedDetails}
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xs">
                {(
                  [
                    ['email', copy.showEmail],
                    ['phone', copy.showPhone],
                    ['pronouns', copy.showPronouns],
                    ['household', copy.showHousehold],
                    ['photo', copy.showPhoto],
                  ] as Array<[keyof DirectoryProfile['visibility'], string]>
                ).map(([key, label]) => (
                  <Switch
                    key={key}
                    label={label}
                    checked={profile.visibility[key]}
                    onChange={(event) => visibility(key, event.currentTarget.checked)}
                    className={classes.sharingSwitch}
                  />
                ))}
              </SimpleGrid>
              <Text c="dimmed" size="xs" mt="md" aria-live="polite">
                {sharedDetails.join(' · ') || copy.noSharedDetails}
              </Text>
            </Box>
          ) : null}
        </Paper>
      ) : null}

      <Group className={classes.saveBar} justify="space-between" wrap="wrap">
        <Text
          size="sm"
          c={hasChanges ? 'brand.8' : 'dimmed'}
          fw={hasChanges ? 700 : 500}
          role="status"
          aria-live="polite"
        >
          {hasChanges ? copy.unsaved : copy.saved}
        </Text>
        <Group gap="sm">
          {hasChanges ? (
            <Button variant="subtle" color="dark" onClick={() => setProfile(savedProfile)}>
              {copy.cancel}
            </Button>
          ) : null}
          <Button type="submit" form="member-profile-form" loading={busy} disabled={!hasChanges}>
            {copy.save}
          </Button>
        </Group>
      </Group>

      <details className={classes.accountOptions}>
        <summary>
          <span>
            <strong>{copy.accountOptions}</strong>
            <small>{copy.accountOptionsHelp}</small>
          </span>
        </summary>
        <div className={classes.dangerContent}>
          <Box>
            <Text fw={700}>{copy.deletionTitle}</Text>
            <Text c="dimmed" size="sm" mt={4} maw={680}>
              {copy.deletionHelp}
            </Text>
          </Box>
          <Button
            color="red"
            variant="light"
            leftSection={<IconTrash size={18} />}
            onClick={() => {
              setDeleteConfirmation('');
              setDeleteOpened(true);
            }}
          >
            {copy.requestDeletion}
          </Button>
        </div>
      </details>

      <Modal
        opened={deleteOpened}
        onClose={closeDeleteModal}
        title={copy.deletionTitle}
        centered
        size="md"
      >
        <Stack>
          <Alert color="red" icon={<IconAlertCircle size={18} />}>
            {copy.deletionModalHelp}
          </Alert>
          <TextInput
            label={copy.confirmationLabel}
            description={copy.confirmationHelp}
            value={deleteConfirmation}
            autoComplete="off"
            data-autofocus
            onChange={(event) => setDeleteConfirmation(event.currentTarget.value)}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={closeDeleteModal}>
              {copy.cancel}
            </Button>
            <Button
              color="red"
              leftSection={<IconTrash size={18} />}
              loading={busy}
              disabled={deleteConfirmation !== copy.deletePhrase}
              onClick={() =>
                run(async () => {
                  await requestProfileDeletion(access);
                  await refresh();
                })
              }
            >
              {copy.requestDeletion}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

function AvatarPanel({
  uid,
  name,
  copy,
  busy,
  run,
}: {
  uid: string;
  name: string;
  copy: typeof copyByLocale.en;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [removeOpened, setRemoveOpened] = useState(false);
  useEffect(() => {
    if (isPhotoWorkerConfigured()) {
      fetchAvatar(uid, 'pending')
        .then((pending) => pending || fetchAvatar(uid))
        .then(setUrl);
    }
  }, [uid]);
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.photoCard}>
      <Title order={3}>{copy.photo}</Title>
      <Text c="dimmed" mt={4} size="sm">
        {copy.photoHelp}
      </Text>
      <Group mt="xl" align="center" wrap="nowrap" className={classes.photoPicker}>
        <Avatar src={url} name={name} size={96} radius="xl" className={classes.profileAvatar} />
        <FileInput
          accept="image/jpeg,image/png,image/webp"
          label={copy.choosePhoto}
          description={copy.photoFormats}
          value={file}
          onChange={setFile}
          leftSection={<IconCamera size={16} />}
          clearable
          className={classes.photoInput}
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
            {url ? copy.replacePhoto : copy.uploadPhoto}
          </Button>
          {url ? (
            <Button color="red" variant="subtle" onClick={() => setRemoveOpened(true)}>
              {copy.removePhoto}
            </Button>
          ) : null}
        </Group>
      ) : (
        <Alert color="moss" mt="lg">
          {copy.setupTitle}
        </Alert>
      )}
      <Modal
        opened={removeOpened}
        onClose={() => setRemoveOpened(false)}
        title={copy.removePhotoTitle}
        centered
        size="sm"
      >
        <Text c="dimmed" size="sm">
          {copy.removePhotoHelp}
        </Text>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={() => setRemoveOpened(false)}>
            {copy.cancel}
          </Button>
          <Button
            color="red"
            loading={busy}
            onClick={() =>
              run(async () => {
                await deleteMyAvatar();
                setUrl(null);
                setRemoveOpened(false);
              })
            }
          >
            {copy.removePhoto}
          </Button>
        </Group>
      </Modal>
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
    const [nextEvents, nextUpdates] = await Promise.all([
      loadEvents([groupId], from, to),
      loadUpdates([groupId]),
    ]);
    setEvents(nextEvents);
    setUpdates(nextUpdates);
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
    if (tab === 'members') {
      setMembers(await loadMembersByStatus(status));
    } else if (tab === 'photos') {
      setPhotos(await loadAvatarModeration());
    } else if (tab === 'audit') {
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
          {member.status === 'pending' ? (
            <Text size="sm" mt="sm">
              {connectionLabel(copy, member.connection)}
            </Text>
          ) : null}
          {member.status === 'pending' && member.requestNote ? (
            <Text size="sm" c="dimmed" mt={4} maw={620}>
              {member.requestNote}
            </Text>
          ) : null}
        </div>
        <Group>
          {member.status === 'pending' ? (
            <AdminAccessReview
              copy={copy}
              actor={access}
              member={member}
              busy={busy}
              run={run}
              reload={reload}
            />
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

function AdminAccessReview({
  copy,
  actor,
  member,
  busy,
  run,
  reload,
}: {
  copy: typeof copyByLocale.en;
  actor: MemberAccess;
  member: MemberAccess;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  reload: () => Promise<void>;
}) {
  const [opened, setOpened] = useState(false);
  const [profile, setProfile] = useState<DirectoryProfile | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const open = async () => {
    setProfile((await loadOwnProfile(member.uid, true)) ?? emptyProfile(member.uid, member.email));
    setRejecting(false);
    setReason('');
    setOpened(true);
  };
  const decide = (status: 'approved' | 'rejected', statusReason = '') =>
    run(async () => {
      await changeMemberStatus(actor, member, status, statusReason);
      setOpened(false);
      await reload();
    });
  return (
    <>
      <Button size="xs" onClick={open}>
        {copy.reviewRequest}
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={copy.requestDetails}
        centered
        size="lg"
      >
        <Stack>
          <div>
            <Text fw={800}>{member.displayName}</Text>
            <Text size="sm" c="dimmed">
              {member.email}
            </Text>
          </div>
          <Paper withBorder p="md">
            <Text fw={700}>{copy.connection}</Text>
            <Text size="sm" mt={4}>
              {connectionLabel(copy, member.connection)}
            </Text>
            <Text fw={700} mt="md">
              {copy.requestNote}
            </Text>
            <Text size="sm" mt={4} className={classes.preserveLines}>
              {member.requestNote || copy.noRequestNote}
            </Text>
          </Paper>
          {profile ? (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <div>
                <Text size="xs" c="dimmed">
                  {copy.displayName}
                </Text>
                <Text>{profile.displayName}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  {copy.preferredName}
                </Text>
                <Text>{profile.preferredName || copy.empty}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  {copy.phone}
                </Text>
                <Text>{profile.phone || copy.empty}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  {copy.household}
                </Text>
                <Text>{profile.household || copy.empty}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  {copy.interests}
                </Text>
                <Text>{profile.ministryInterests || copy.empty}</Text>
              </div>
            </SimpleGrid>
          ) : (
            <Center py="md">
              <Loader />
            </Center>
          )}
          {rejecting ? (
            <Textarea
              label={copy.rejectReason}
              description={copy.rejectReasonHelp}
              value={reason}
              required
              maxLength={300}
              minRows={3}
              onChange={(event) => setReason(event.currentTarget.value)}
            />
          ) : null}
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setOpened(false)}>
              {copy.cancel}
            </Button>
            {rejecting ? (
              <Button
                color="red"
                loading={busy}
                disabled={!reason.trim()}
                onClick={() => decide('rejected', reason)}
              >
                {copy.rejectRequest}
              </Button>
            ) : (
              <>
                <Button color="red" variant="light" onClick={() => setRejecting(true)}>
                  {copy.rejectRequest}
                </Button>
                <Button loading={busy} onClick={() => decide('approved')}>
                  {copy.approveRequest}
                </Button>
              </>
            )}
          </Group>
        </Stack>
      </Modal>
    </>
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
