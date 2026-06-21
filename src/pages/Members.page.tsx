/* eslint-disable no-alert */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  IconAddressBook,
  IconAlertCircle,
  IconCake,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconEdit,
  IconFileText,
  IconHeart,
  IconHome,
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
  Group,
  Loader,
  Modal,
  MultiSelect,
  Notification,
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
import { AvatarCropper } from '../components/member/AvatarCropper';
import { siteConfig } from '../content/churchContent';
import { notifyMemberAccessRequest } from '../lib/formConfig';
import { useLocale } from '../lib/i18n';
import {
  changePortalAccessStatus,
  changePortalPermission,
  completeEmailLinkSignIn,
  createIcs,
  deleteCurrentAuthAccount,
  deleteEvent,
  deleteGroup,
  deleteUpdate,
  ensureMemberOnboardingAccount,
  getMissingFirebaseConfigKeys,
  isMemberPortalConfigured,
  loadAccessibleEvents,
  loadAccessibleUpdates,
  loadAdminGroups,
  loadAdminHouseholds,
  loadAdminMemberRecords,
  loadAdminRelationships,
  loadAdminUpdates,
  loadAuditLogs,
  loadAvatarModeration,
  loadDirectoryConnections,
  loadDirectoryPage,
  loadEvents,
  loadGroup,
  loadGroupMembers,
  loadGroupMembership,
  loadHouseholdForMember,
  loadMemberAccess,
  loadMemberAdminNotes,
  loadMembersByStatus,
  loadMembershipGroupIds,
  loadMyGroups,
  loadMyMembershipGroups,
  loadOwnChurchMetadata,
  loadOwnProfile,
  loadRelationshipsForMember,
  loadUpcomingAnniversaries,
  loadUpcomingBirthdays,
  loadUpdates,
  migrateLegacyDirectoryEntry,
  processDeletion,
  removeGroupMembership,
  requestMemberAreaAccess,
  requestProfileDeletion,
  saveChurchMetadata,
  saveEvent,
  saveGroup,
  saveGroupMembership,
  saveHousehold,
  saveMemberAdminNotes,
  saveMemberProfile,
  saveOwnProfile,
  saveRelationship,
  saveUpdate,
  sendMemberSignInLink,
  signOutMember,
  subscribeToAuth,
  type AdminMemberRecord,
  type AuditLog,
  type AvatarMetadata,
  type ChurchMetadata,
  type ChurchRole,
  type ChurchStatus,
  type DirectoryEntry,
  type DirectoryProfile,
  type GroupEvent,
  type GroupMembership,
  type GroupRole,
  type GroupUpdate,
  type Household,
  type HouseholdDirectoryEntry,
  type MemberAccess,
  type MemberAdminNotes,
  type MemberConnection,
  type MemberRelationship,
  type PortalAccessStatus,
  type PortalGroup,
  type RelationshipAudience,
  type RelationshipDirectoryEntry,
  type RelationshipType,
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
import {
  CHURCH_ROLE_OPTIONS,
  CHURCH_STATUS_OPTIONS,
  CONTACT_CHANNEL_OPTIONS,
  defaultDirectoryVisibility,
  emptyChurchMetadata,
  emptyDirectoryProfile,
  formatAddress,
  formatBirthday,
  formatPhone,
  isValidEmail,
  isValidMonthDay,
  MINISTRY_INTEREST_OPTIONS,
  normalizeDirectoryProfile,
  optionData,
  optionLabel,
  searchableMemberText,
  type ContactChannel,
  type MinistryInterestId,
  type PreferredContactMethod,
} from '../lib/memberProfile';
import { getLocalizedPath, type RouteId } from '../lib/routing';
import classes from './Members.page.module.css';

type PortalSection =
  | 'home'
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
    home: 'Home',
    welcome: 'Welcome',
    quickLinks: 'Member links',
    viewAll: 'View all',
    upcomingEvents: 'Upcoming events',
    celebrations: 'Celebrations',
    birthdays: 'Birthdays',
    anniversaries: 'Anniversaries',
    yourGroups: 'Your groups',
    profile: 'Profile',
    directory: 'Directory',
    groups: 'Groups',
    calendar: 'Calendar',
    updates: 'Announcements',
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
    interestsNoObligation: 'Selecting an interest does not commit you to serve.',
    otherInterest: 'Other ministry interest',
    addressingNote: 'How should we address you?',
    addressingNoteHelp:
      'Optional notes about titles, greetings, or how you prefer to be addressed.',
    birthday: 'Birthday',
    birthdayHelp: 'Month and day only. Your birth year is not collected.',
    month: 'Month',
    day: 'Day',
    contactHeading: 'Contact information',
    contactHelp: 'Choose how church staff may contact you. Text messages require explicit consent.',
    alternateEmail: 'Alternate email',
    alternateEmailHelp:
      'Used for contact and shown instead of your sign-in email if you share email.',
    communicationPreferences: 'Allowed contact methods',
    preferredContact: 'Preferred contact method',
    noRoutineContact: 'No routine contact',
    phoneRequired: 'Add a valid phone number before choosing phone calls or text messages.',
    invalidPhone: 'Enter a 10-digit U.S. number or an international number beginning with +.',
    invalidEmail: 'Enter a valid email address.',
    invalidBirthday: 'Choose a valid month and day.',
    addressHeading: 'Mailing address',
    addressHelp: 'Church staff can use this address even when you keep it out of the directory.',
    addressLine1: 'Street address',
    addressLine2: 'Address line 2',
    city: 'City',
    region: 'State or region',
    postalCode: 'ZIP or postal code',
    country: 'Country',
    householdHelp: 'Share family or household information in whatever wording fits your household.',
    officialHeading: 'Official church record',
    officialHelp:
      'Church staff manage these values. Contact the church office if a correction is needed.',
    churchStatus: 'Church status',
    churchRoles: 'Church roles',
    dateJoined: 'Date joined',
    notAssigned: 'Not assigned',
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
    showPreferredName: 'Show my preferred name',
    showAddress: 'Show my address',
    showBirthday: 'Show my birthday',
    showHousehold: 'Show my household',
    showRelationships: 'Show my relationships',
    showAnniversary: 'Show my anniversary',
    showInterests: 'Show my ministry interests',
    showChurchStatus: 'Show my church status',
    showChurchRoles: 'Show my church roles',
    showPhoto: 'Show my approved photo',
    photo: 'Profile photo',
    photoHelp:
      'Position and compress your photo in this browser before submitting it for approval.',
    choosePhoto: 'Choose photo',
    photoFormats: 'JPG, PNG, WebP, HEIC, or HEIF up to 25 MB.',
    cropTitle: 'Position your profile photo',
    cropHelp: 'Use the controls to choose which part of the photo stays centered in your profile.',
    cropHorizontal: 'Move photo left or right',
    cropVertical: 'Move photo up or down',
    uploadPhoto: 'Submit photo for review',
    replacePhoto: 'Replace photo',
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
    deleteGroup: 'Delete group',
    deleteGroupConfirm: 'Delete this group and deactivate all of its events and announcements?',
    groupSettings: 'Group settings',
    members: 'Members',
    addMember: 'Add member',
    roles: 'Group roles',
    saveRoles: 'Save roles',
    removeMember: 'Remove member',
    add: 'Add',
    events: 'Events',
    newEvent: 'New event',
    editEvent: 'Edit event',
    deleteEventConfirm: 'Delete this event?',
    titleLabel: 'Title',
    location: 'Location',
    starts: 'Starts',
    ends: 'Ends',
    allDay: 'All-day event',
    publishEvent: 'Save event',
    addCalendar: 'Download .ics',
    canceled: 'Canceled',
    announcements: 'Announcements',
    newUpdate: 'New announcement',
    editUpdate: 'Edit announcement',
    deleteUpdateConfirm: 'Delete this announcement?',
    summary: 'Summary',
    publishDate: 'Publish date',
    expires: 'Expires (optional)',
    body: 'Message',
    important: 'Important',
    pinned: 'Pinned',
    publish: 'Save announcement',
    churchWide: 'Church-wide',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    today: 'Today',
    edit: 'Edit',
    deleteAction: 'Delete',
    householdRelationships: 'Household and relationships',
    householdRelationshipsHelp:
      'Church staff maintain these connections. Your privacy choices control what other members see.',
    noHousehold: 'No household is connected to your profile.',
    householdsAdmin: 'Households & relationships',
    householdsAdminHelp: 'Manage household membership, relationships, and anniversary dates.',
    newHousehold: 'New household',
    newRelationship: 'New relationship',
    householdName: 'Household name',
    relationshipType: 'Relationship',
    relationshipAudience: 'Audience',
    linkedOnly: 'Linked people only',
    personA: 'First person',
    personB: 'Second person',
    anniversary: 'Anniversary',
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
    editChurchRecord: 'Edit church record',
    editInternalNotes: 'Internal notes',
    membershipNotes: 'Membership notes',
    internalNotes: 'Internal notes',
    lastReviewed: 'Last reviewed',
    markReviewed: 'Save and mark reviewed now',
    searchMembers: 'Search member records',
    accessStatusFilter: 'Portal access status',
    churchStatusFilter: 'Church status',
    churchRoleFilter: 'Church role',
    ministryFilter: 'Ministry interest',
    allOptions: 'All',
    portalPermission: 'Portal permission',
    processDeletion: 'Process deletion',
    audit: 'Audit history',
    photos: 'Photo review',
    approvePhoto: 'Approve photo',
    rejectPhoto: 'Reject photo',
    adminUpload: 'Upload with member consent',
    adminConfirmPhoto: 'Upload positioned photo',
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
    home: 'Inicio',
    welcome: 'Bienvenido',
    quickLinks: 'Enlaces para miembros',
    viewAll: 'Ver todo',
    upcomingEvents: 'Próximos eventos',
    celebrations: 'Celebraciones',
    birthdays: 'Cumpleaños',
    anniversaries: 'Aniversarios',
    yourGroups: 'Sus grupos',
    profile: 'Perfil',
    directory: 'Directorio',
    groups: 'Grupos',
    calendar: 'Calendario',
    updates: 'Anuncios',
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
    interestsNoObligation: 'Seleccionar un interés no le obliga a servir.',
    otherInterest: 'Otro interés ministerial',
    addressingNote: '¿Cómo debemos dirigirnos a usted?',
    addressingNoteHelp:
      'Notas opcionales sobre títulos, saludos o cómo prefiere que se dirijan a usted.',
    birthday: 'Cumpleaños',
    birthdayHelp: 'Solo mes y día. No recopilamos el año de nacimiento.',
    month: 'Mes',
    day: 'Día',
    contactHeading: 'Información de contacto',
    contactHelp:
      'Elija cómo puede contactarle el personal. Los mensajes de texto requieren permiso explícito.',
    alternateEmail: 'Correo alternativo',
    alternateEmailHelp:
      'Se usa para contacto y se muestra en lugar del correo de acceso si comparte su correo.',
    communicationPreferences: 'Métodos de contacto permitidos',
    preferredContact: 'Método de contacto preferido',
    noRoutineContact: 'Sin contacto rutinario',
    phoneRequired: 'Agregue un teléfono válido antes de elegir llamadas o mensajes de texto.',
    invalidPhone:
      'Ingrese un número estadounidense de 10 dígitos o uno internacional que comience con +.',
    invalidEmail: 'Ingrese un correo electrónico válido.',
    invalidBirthday: 'Elija un mes y día válidos.',
    addressHeading: 'Dirección postal',
    addressHelp: 'El personal puede usar esta dirección aunque no la comparta en el directorio.',
    addressLine1: 'Dirección',
    addressLine2: 'Línea de dirección 2',
    city: 'Ciudad',
    region: 'Estado o región',
    postalCode: 'Código postal',
    country: 'País',
    householdHelp:
      'Comparta información familiar o del hogar con las palabras que mejor le representen.',
    officialHeading: 'Registro oficial de la iglesia',
    officialHelp:
      'El personal administra estos valores. Comuníquese con la oficina si necesita una corrección.',
    churchStatus: 'Estado en la iglesia',
    churchRoles: 'Funciones en la iglesia',
    dateJoined: 'Fecha de ingreso',
    notAssigned: 'Sin asignar',
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
    showPreferredName: 'Mostrar mi nombre preferido',
    showAddress: 'Mostrar mi dirección',
    showBirthday: 'Mostrar mi cumpleaños',
    showHousehold: 'Mostrar mi hogar',
    showRelationships: 'Mostrar mis relaciones',
    showAnniversary: 'Mostrar mi aniversario',
    showInterests: 'Mostrar mis intereses ministeriales',
    showChurchStatus: 'Mostrar mi estado en la iglesia',
    showChurchRoles: 'Mostrar mis funciones en la iglesia',
    showPhoto: 'Mostrar mi foto aprobada',
    photo: 'Foto de perfil',
    photoHelp: 'Posicione y comprima su foto en este navegador antes de enviarla para aprobación.',
    choosePhoto: 'Elegir foto',
    photoFormats: 'JPG, PNG, WebP, HEIC o HEIF de hasta 25 MB.',
    cropTitle: 'Posicione su foto de perfil',
    cropHelp: 'Use los controles para elegir qué parte de la foto queda centrada en su perfil.',
    cropHorizontal: 'Mover foto a la izquierda o derecha',
    cropVertical: 'Mover foto hacia arriba o abajo',
    uploadPhoto: 'Enviar foto para revisión',
    replacePhoto: 'Reemplazar foto',
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
    deleteGroup: 'Eliminar grupo',
    deleteGroupConfirm: '¿Eliminar este grupo y desactivar todos sus eventos y anuncios?',
    groupSettings: 'Configuración del grupo',
    members: 'Miembros',
    addMember: 'Agregar miembro',
    roles: 'Funciones del grupo',
    saveRoles: 'Guardar funciones',
    removeMember: 'Quitar miembro',
    add: 'Agregar',
    events: 'Eventos',
    newEvent: 'Nuevo evento',
    editEvent: 'Editar evento',
    deleteEventConfirm: '¿Eliminar este evento?',
    titleLabel: 'Título',
    location: 'Lugar',
    starts: 'Comienza',
    ends: 'Termina',
    allDay: 'Evento de todo el día',
    publishEvent: 'Guardar evento',
    addCalendar: 'Descargar .ics',
    canceled: 'Cancelado',
    announcements: 'Anuncios',
    newUpdate: 'Nuevo anuncio',
    editUpdate: 'Editar anuncio',
    deleteUpdateConfirm: '¿Eliminar este anuncio?',
    summary: 'Resumen',
    publishDate: 'Fecha de publicación',
    expires: 'Vence (opcional)',
    body: 'Mensaje',
    important: 'Importante',
    pinned: 'Fijado',
    publish: 'Guardar anuncio',
    churchWide: 'Toda la iglesia',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    today: 'Hoy',
    edit: 'Editar',
    deleteAction: 'Eliminar',
    householdRelationships: 'Hogar y relaciones',
    householdRelationshipsHelp:
      'El personal mantiene estas conexiones. Sus opciones de privacidad controlan lo que ven los demás.',
    noHousehold: 'No hay un hogar conectado a su perfil.',
    householdsAdmin: 'Hogares y relaciones',
    householdsAdminHelp: 'Administre hogares, relaciones y fechas de aniversario.',
    newHousehold: 'Nuevo hogar',
    newRelationship: 'Nueva relación',
    householdName: 'Nombre del hogar',
    relationshipType: 'Relación',
    relationshipAudience: 'Audiencia',
    linkedOnly: 'Solo personas relacionadas',
    personA: 'Primera persona',
    personB: 'Segunda persona',
    anniversary: 'Aniversario',
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
    editChurchRecord: 'Editar registro de la iglesia',
    editInternalNotes: 'Notas internas',
    membershipNotes: 'Notas de membresía',
    internalNotes: 'Notas internas',
    lastReviewed: 'Última revisión',
    markReviewed: 'Guardar y marcar como revisado ahora',
    searchMembers: 'Buscar registros de miembros',
    accessStatusFilter: 'Estado de acceso al portal',
    churchStatusFilter: 'Estado en la iglesia',
    churchRoleFilter: 'Función en la iglesia',
    ministryFilter: 'Interés ministerial',
    allOptions: 'Todos',
    portalPermission: 'Permiso del portal',
    processDeletion: 'Procesar eliminación',
    audit: 'Historial',
    photos: 'Revisión de fotos',
    approvePhoto: 'Aprobar foto',
    rejectPhoto: 'Rechazar foto',
    adminUpload: 'Subir con consentimiento',
    adminConfirmPhoto: 'Subir foto posicionada',
    consent: 'Confirmo que el miembro dio permiso para esta foto.',
    noAccess: 'No tiene permiso para abrir esta sección.',
    givingHelp:
      'Este portal no guarda documentos fiscales. Tithely y la oficina proporcionan comprobantes.',
    openTithely: 'Abrir Tithely',
    contactOffice: 'Contactar la oficina',
  },
};

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
  return <MemberPortalPage section="home" />;
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
  const [church, setChurch] = useState<ChurchMetadata | null>(null);
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
    const [nextProfile, nextChurch] = await Promise.all([
      loadOwnProfile(currentUser.uid, forceRefresh),
      loadOwnChurchMetadata(currentUser.uid, forceRefresh).catch(() =>
        emptyChurchMetadata(currentUser.uid)
      ),
    ]);
    setAccess(nextAccess);
    const resolved = nextProfile ?? emptyDirectoryProfile(currentUser.uid, currentUser.email ?? '');
    setProfile(resolved);
    setChurch(nextChurch);
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
        setChurch(null);
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
    if (!notice) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

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
    <>
      {notice ? (
        <div className={classes.portalToast} data-testid="portal-toast">
          <Notification
            role={notice.type === 'error' ? 'alert' : 'status'}
            aria-live={notice.type === 'error' ? 'assertive' : 'polite'}
            color={notice.type === 'success' ? 'green' : 'red'}
            icon={
              notice.type === 'success' ? (
                <IconCircleCheck size={18} />
              ) : (
                <IconAlertCircle size={18} />
              )
            }
            title={notice.type === 'success' ? copy.saved : copy.error}
            onClose={() => setNotice(null)}
            withBorder
          >
            {notice.text}
          </Notification>
        </div>
      ) : null}
      <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
        <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
        <Stack gap="xl" mt="xl">
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
              {access?.status === 'approved' && profile && church ? (
                <PortalShell
                  section={section}
                  access={access}
                  profile={profile}
                  church={church}
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
    </>
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
        church={emptyChurchMetadata(access.uid)}
        locale={locale}
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
  church,
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
  church: ChurchMetadata;
  setProfile: (profile: DirectoryProfile) => void;
  copy: typeof copyByLocale.en;
  locale: 'en' | 'es';
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  refresh: () => Promise<void>;
}) {
  const navigate = useNavigate();
  const routeFor: Record<Exclude<PortalSection, 'group'>, RouteId> = {
    home: 'members',
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
    { value: 'home', label: copy.home, icon: <IconHome size={17} /> },
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
        <ProfilePanel
          {...{ profile, church, setProfile, copy, busy, run, refresh, access, locale }}
        />
      ) : null}
      {section === 'home' ? <MemberHomePanel {...{ copy, access, profile, locale }} /> : null}
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

function MemberHomePanel({
  copy,
  access,
  profile,
  locale,
}: {
  copy: typeof copyByLocale.en;
  access: MemberAccess;
  profile: DirectoryProfile;
  locale: 'en' | 'es';
}) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [updates, setUpdates] = useState<GroupUpdate[]>([]);
  const [groups, setGroups] = useState<PortalGroup[]>([]);
  const [birthdays, setBirthdays] = useState<Awaited<ReturnType<typeof loadUpcomingBirthdays>>>([]);
  const [anniversaries, setAnniversaries] = useState<
    Awaited<ReturnType<typeof loadUpcomingAnniversaries>>
  >([]);

  useEffect(() => {
    const from = new Date();
    const to = new Date(from);
    to.setDate(to.getDate() + 60);
    Promise.all([loadMembershipGroupIds(access.uid), loadMyMembershipGroups(access.uid)])
      .then(async ([groupIds, memberGroups]) => {
        const [nextEvents, nextUpdates, nextBirthdays, nextAnniversaries] = await Promise.all([
          loadAccessibleEvents(access, groupIds, from, to, 12),
          loadAccessibleUpdates(access, groupIds, 12),
          loadUpcomingBirthdays(from, 30, 8),
          loadUpcomingAnniversaries(access.uid, from, 30, 8),
        ]);
        setGroups(memberGroups);
        setEvents(nextEvents.filter((event) => event.status === 'scheduled').slice(0, 5));
        setUpdates(nextUpdates.slice(0, 5));
        setBirthdays(nextBirthdays);
        setAnniversaries(nextAnniversaries);
      })
      .finally(() => setLoading(false));
  }, [access.uid, access.role]);

  const name = profile.preferredName || profile.displayName || access.displayName;
  const links: Array<{ route: RouteId; label: string; icon: ReactNode }> = [
    { route: 'memberCalendar', label: copy.calendar, icon: <IconCalendar size={20} /> },
    { route: 'memberUpdates', label: copy.announcements, icon: <IconMessage size={20} /> },
    { route: 'memberGroups', label: copy.groups, icon: <IconUsers size={20} /> },
    { route: 'memberProfile', label: copy.profile, icon: <IconUser size={20} /> },
  ];

  return (
    <Stack gap="lg">
      <Paper className={classes.memberHomeWelcome} p={{ base: 'lg', md: 'xl' }}>
        <Text className={classes.sectionEyebrow}>{copy.home}</Text>
        <Title order={2}>
          {copy.welcome}
          {name ? `, ${name}` : ''}
        </Title>
        <Text c="dimmed" mt="xs">
          {copy.description}
        </Text>
      </Paper>

      <SimpleGrid cols={{ base: 2, md: 4 }}>
        {links.map((link) => (
          <Button
            key={link.route}
            component={Link}
            to={getLocalizedPath(link.route, locale)}
            variant="light"
            leftSection={link.icon}
            className={classes.quickLink}
          >
            {link.label}
          </Button>
        ))}
      </SimpleGrid>

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : (
        <>
          {events.length ? (
            <HomeSection
              title={copy.upcomingEvents}
              link={getLocalizedPath('memberCalendar', locale)}
              copy={copy}
            >
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                {events.map((event) => (
                  <Paper key={event.id} withBorder p="md">
                    <Text fw={800}>{event.title}</Text>
                    <Text size="sm" c="dimmed">
                      {event.startsAt.toLocaleString(locale === 'es' ? 'es-US' : 'en-US')}
                    </Text>
                    {event.location ? <Text size="sm">{event.location}</Text> : null}
                    {event.groupName ? (
                      <Badge mt="xs" variant="light">
                        {event.groupName}
                      </Badge>
                    ) : null}
                  </Paper>
                ))}
              </SimpleGrid>
            </HomeSection>
          ) : null}

          {updates.length ? (
            <HomeSection
              title={copy.announcements}
              link={getLocalizedPath('memberUpdates', locale)}
              copy={copy}
            >
              <Stack gap="sm">
                {updates.map((update) => (
                  <Paper key={update.id} withBorder p="md">
                    <Group gap="xs">
                      {update.important ? <Badge color="red">{copy.important}</Badge> : null}
                      {update.groupName ? <Badge variant="light">{update.groupName}</Badge> : null}
                    </Group>
                    <Text fw={800} mt={update.important || update.groupName ? 'xs' : 0}>
                      {update.title}
                    </Text>
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {update.summary || update.body}
                    </Text>
                  </Paper>
                ))}
              </Stack>
            </HomeSection>
          ) : null}

          {birthdays.length || anniversaries.length ? (
            <HomeSection title={copy.celebrations} copy={copy}>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                {birthdays.length ? (
                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconCake size={20} />
                      <Title order={3}>{copy.birthdays}</Title>
                    </Group>
                    {birthdays.map((birthday) => (
                      <Text key={birthday.uid}>
                        {birthday.preferredName || birthday.displayName} ·{' '}
                        {formatBirthday(birthday.birthday, locale)}
                      </Text>
                    ))}
                  </Stack>
                ) : null}
                {anniversaries.length ? (
                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconHeart size={20} />
                      <Title order={3}>{copy.anniversaries}</Title>
                    </Group>
                    {anniversaries.map((anniversary) => (
                      <Text key={anniversary.id}>
                        {anniversary.memberNames.join(' & ')} ·{' '}
                        {formatBirthday(anniversary.anniversary, locale)}
                      </Text>
                    ))}
                  </Stack>
                ) : null}
              </SimpleGrid>
            </HomeSection>
          ) : null}

          {groups.length ? (
            <HomeSection
              title={copy.yourGroups}
              link={getLocalizedPath('memberGroups', locale)}
              copy={copy}
            >
              <Group>
                {groups.map((group) => (
                  <Button
                    key={group.id}
                    component={Link}
                    to={`${getLocalizedPath('memberGroups', locale)}/${group.id}`}
                    variant="light"
                  >
                    {group.name}
                  </Button>
                ))}
              </Group>
            </HomeSection>
          ) : null}
        </>
      )}
    </Stack>
  );
}

function HomeSection({
  title,
  link,
  copy,
  children,
}: {
  title: string;
  link?: string;
  copy: typeof copyByLocale.en;
  children: ReactNode;
}) {
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
      <Group justify="space-between" mb="md">
        <Title order={2}>{title}</Title>
        {link ? (
          <Button component={Link} to={link} variant="subtle">
            {copy.viewAll}
          </Button>
        ) : null}
      </Group>
      {children}
    </Paper>
  );
}

function MemberConnectionsCard({ uid, copy }: { uid: string; copy: typeof copyByLocale.en }) {
  const locale = useLocale();
  const [household, setHousehold] = useState<Household | null>(null);
  const [relationships, setRelationships] = useState<MemberRelationship[]>([]);
  useEffect(() => {
    Promise.all([loadHouseholdForMember(uid), loadRelationshipsForMember(uid)]).then(
      ([nextHousehold, nextRelationships]) => {
        setHousehold(nextHousehold);
        setRelationships(nextRelationships);
      }
    );
  }, [uid]);
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.profileCard}>
      <Title order={3}>{copy.householdRelationships}</Title>
      <Text c="dimmed" size="sm" mt="xs">
        {copy.householdRelationshipsHelp}
      </Text>
      {household ? (
        <Box mt="md">
          <Text fw={700}>{household.name}</Text>
          <Text size="sm">{household.memberNames.join(', ')}</Text>
        </Box>
      ) : (
        <Text c="dimmed" mt="md">
          {copy.noHousehold}
        </Text>
      )}
      {relationships.length ? (
        <Stack gap="xs" mt="md">
          {relationships.map((relationship) => (
            <Text key={relationship.id} size="sm">
              {relationship.memberNames.join(' · ')}
              {relationship.anniversary
                ? ` — ${copy.anniversary}: ${formatBirthday(relationship.anniversary, locale)}`
                : ''}
            </Text>
          ))}
        </Stack>
      ) : null}
    </Paper>
  );
}

function ProfilePanel({
  profile,
  church,
  setProfile,
  copy,
  busy,
  run,
  refresh,
  access,
  locale,
  restricted = false,
}: {
  profile: DirectoryProfile;
  church: ChurchMetadata;
  setProfile: (profile: DirectoryProfile) => void;
  copy: typeof copyByLocale.en;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  refresh: () => Promise<void>;
  access: MemberAccess;
  locale: 'en' | 'es';
  restricted?: boolean;
}) {
  const [savedProfile, setSavedProfile] = useState(profile);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
    profile.visibility.preferredName && copy.showPreferredName,
    profile.visibility.email && copy.showEmail,
    profile.visibility.phone && copy.showPhone,
    profile.visibility.pronouns && copy.showPronouns,
    profile.visibility.address && copy.showAddress,
    profile.visibility.birthday && copy.showBirthday,
    profile.visibility.household && copy.showHousehold,
    profile.visibility.relationships && copy.showRelationships,
    profile.visibility.anniversary && copy.showAnniversary,
    profile.visibility.ministryInterests && copy.showInterests,
    profile.visibility.photo && copy.showPhoto,
    profile.visibility.churchStatus && copy.showChurchStatus,
    profile.visibility.churchRoles && copy.showChurchRoles,
  ].filter(Boolean) as string[];

  const saveProfile = () => {
    const errors: Record<string, string> = {};
    if (!isValidEmail(profile.alternateEmail)) {
      errors.alternateEmail = copy.invalidEmail;
    }
    if (profile.birthday && !isValidMonthDay(profile.birthday)) {
      errors.birthday = copy.invalidBirthday;
    }
    if (
      (profile.communicationChannels.includes('phone') ||
        profile.communicationChannels.includes('sms')) &&
      !profile.phone.trim()
    ) {
      errors.phone = copy.phoneRequired;
    }
    let normalized: DirectoryProfile;
    try {
      normalized = normalizeDirectoryProfile(profile);
    } catch (error) {
      if (error instanceof Error && error.message === 'invalid-phone') {
        errors.phone = copy.invalidPhone;
      }
      normalized = profile;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      return;
    }
    run(async () => {
      await saveOwnProfile(normalized, !restricted);
      const saved = restricted
        ? {
            ...normalized,
            visibility: defaultDirectoryVisibility(),
          }
        : normalized;
      setProfile(saved);
      setSavedProfile(saved);
      await refresh();
    });
  };
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
        <form
          id="member-profile-form"
          onSubmit={(event) => {
            event.preventDefault();
            saveProfile();
          }}
        >
          <Stack gap="lg">
            <ProfileSection title={copy.personalDetails} description={copy.personalDetailsHelp}>
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
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label={copy.pronouns}
                  value={profile.pronouns}
                  maxLength={60}
                  onChange={(event) => update({ pronouns: event.currentTarget.value })}
                />
                <TextInput
                  label={copy.addressingNote}
                  description={copy.addressingNoteHelp}
                  value={profile.addressingNote}
                  maxLength={300}
                  onChange={(event) => update({ addressingNote: event.currentTarget.value })}
                />
              </SimpleGrid>
              <Box>
                <Text fw={500} size="sm">
                  {copy.birthday}
                </Text>
                <Text c="dimmed" size="xs" mb="xs">
                  {copy.birthdayHelp}
                </Text>
                <Group grow align="flex-start">
                  <Select
                    label={copy.month}
                    clearable
                    data={Array.from({ length: 12 }, (_, index) => ({
                      value: String(index + 1),
                      label: new Intl.DateTimeFormat(locale === 'es' ? 'es-US' : 'en-US', {
                        month: 'long',
                        timeZone: 'UTC',
                      }).format(new Date(Date.UTC(2024, index, 1))),
                    }))}
                    value={profile.birthday ? String(profile.birthday.month) : null}
                    error={fieldErrors.birthday}
                    onChange={(value) =>
                      update({
                        birthday: value
                          ? { month: Number(value), day: profile.birthday?.day ?? 1 }
                          : null,
                      })
                    }
                  />
                  <Select
                    label={copy.day}
                    clearable
                    disabled={!profile.birthday}
                    data={Array.from({ length: 31 }, (_, index) => String(index + 1))}
                    value={profile.birthday ? String(profile.birthday.day) : null}
                    onChange={(value) =>
                      update({
                        birthday:
                          value && profile.birthday
                            ? { ...profile.birthday, day: Number(value) }
                            : null,
                      })
                    }
                  />
                </Group>
              </Box>
            </ProfileSection>

            <ProfileSection title={copy.contactHeading} description={copy.contactHelp}>
              <TextInput
                label={copy.email}
                description={copy.privateEmailHelp}
                value={profile.email}
                type="email"
                autoComplete="email"
                readOnly
                className={classes.readOnlyField}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label={copy.alternateEmail}
                  description={copy.alternateEmailHelp}
                  value={profile.alternateEmail}
                  type="email"
                  autoComplete="email"
                  error={fieldErrors.alternateEmail}
                  maxLength={320}
                  onChange={(event) => update({ alternateEmail: event.currentTarget.value })}
                />
                <TextInput
                  label={copy.phone}
                  value={formatPhone(profile.phone)}
                  type="tel"
                  autoComplete="tel"
                  error={fieldErrors.phone}
                  maxLength={40}
                  onChange={(event) => update({ phone: event.currentTarget.value })}
                />
              </SimpleGrid>
              <Checkbox.Group
                label={copy.communicationPreferences}
                value={profile.communicationChannels}
                onChange={(values) => {
                  const channels = values as ContactChannel[];
                  update({
                    communicationChannels: channels,
                    preferredContactMethod: channels.includes(
                      profile.preferredContactMethod as ContactChannel
                    )
                      ? profile.preferredContactMethod
                      : (channels[0] ?? 'none'),
                  });
                }}
              >
                <Group mt="xs">
                  {CONTACT_CHANNEL_OPTIONS.map((option) => (
                    <Checkbox
                      key={option.value}
                      value={option.value}
                      label={option.label[locale]}
                    />
                  ))}
                </Group>
              </Checkbox.Group>
              <Checkbox
                label={copy.noRoutineContact}
                checked={profile.communicationChannels.length === 0}
                onChange={(event) => {
                  if (event.currentTarget.checked) {
                    update({ communicationChannels: [], preferredContactMethod: 'none' });
                  } else {
                    update({ communicationChannels: ['email'], preferredContactMethod: 'email' });
                  }
                }}
              />
              <Select
                label={copy.preferredContact}
                disabled={profile.communicationChannels.length === 0}
                allowDeselect={false}
                data={optionData(CONTACT_CHANNEL_OPTIONS, locale).filter((option) =>
                  profile.communicationChannels.includes(option.value)
                )}
                value={
                  profile.preferredContactMethod === 'none' ? null : profile.preferredContactMethod
                }
                onChange={(value) =>
                  update({ preferredContactMethod: (value ?? 'none') as PreferredContactMethod })
                }
              />
            </ProfileSection>

            <ProfileSection title={copy.addressHeading} description={copy.addressHelp}>
              <TextInput
                label={copy.addressLine1}
                autoComplete="address-line1"
                value={profile.address.line1}
                onChange={(event) =>
                  update({ address: { ...profile.address, line1: event.currentTarget.value } })
                }
              />
              <TextInput
                label={copy.addressLine2}
                autoComplete="address-line2"
                value={profile.address.line2}
                onChange={(event) =>
                  update({ address: { ...profile.address, line2: event.currentTarget.value } })
                }
              />
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <TextInput
                  label={copy.city}
                  autoComplete="address-level2"
                  value={profile.address.city}
                  onChange={(event) =>
                    update({ address: { ...profile.address, city: event.currentTarget.value } })
                  }
                />
                <TextInput
                  label={copy.region}
                  autoComplete="address-level1"
                  value={profile.address.region}
                  onChange={(event) =>
                    update({ address: { ...profile.address, region: event.currentTarget.value } })
                  }
                />
                <TextInput
                  label={copy.postalCode}
                  autoComplete="postal-code"
                  value={profile.address.postalCode}
                  onChange={(event) =>
                    update({
                      address: { ...profile.address, postalCode: event.currentTarget.value },
                    })
                  }
                />
              </SimpleGrid>
              <TextInput
                label={copy.country}
                autoComplete="country-name"
                value={profile.address.country}
                onChange={(event) =>
                  update({ address: { ...profile.address, country: event.currentTarget.value } })
                }
              />
            </ProfileSection>

            <ProfileSection title={copy.household} description={copy.householdHelp}>
              <Textarea
                label={copy.household}
                value={profile.household}
                maxLength={1000}
                minRows={3}
                autosize
                onChange={(event) => update({ household: event.currentTarget.value })}
              />
            </ProfileSection>

            <ProfileSection title={copy.interests} description={copy.interestsHelp}>
              <MultiSelect
                label={copy.interests}
                description={copy.interestsNoObligation}
                data={optionData(MINISTRY_INTEREST_OPTIONS, locale)}
                value={profile.ministryInterests}
                searchable
                onChange={(values) => update({ ministryInterests: values as MinistryInterestId[] })}
              />
              {profile.ministryInterests.includes('other') ? (
                <TextInput
                  label={copy.otherInterest}
                  value={profile.otherMinistryInterest}
                  maxLength={300}
                  onChange={(event) => update({ otherMinistryInterest: event.currentTarget.value })}
                />
              ) : null}
            </ProfileSection>

            {!restricted ? (
              <ProfileSection title={copy.officialHeading} description={copy.officialHelp}>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                  <ReadOnlyValue
                    label={copy.churchStatus}
                    value={
                      optionLabel(CHURCH_STATUS_OPTIONS, church.churchStatus, locale) ||
                      copy.notAssigned
                    }
                  />
                  <ReadOnlyValue
                    label={copy.churchRoles}
                    value={
                      church.churchRoles
                        .map((role) => optionLabel(CHURCH_ROLE_OPTIONS, role, locale))
                        .join(', ') || copy.notAssigned
                    }
                  />
                  <ReadOnlyValue
                    label={copy.dateJoined}
                    value={formatDateOnly(church.dateJoined, locale) || copy.notAssigned}
                  />
                </SimpleGrid>
              </ProfileSection>
            ) : null}
          </Stack>
        </form>

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

      {!restricted ? <MemberConnectionsCard uid={profile.uid} copy={copy} /> : null}

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
                    ['preferredName', copy.showPreferredName],
                    ['email', copy.showEmail],
                    ['phone', copy.showPhone],
                    ['pronouns', copy.showPronouns],
                    ['address', copy.showAddress],
                    ['birthday', copy.showBirthday],
                    ['household', copy.showHousehold],
                    ['relationships', copy.showRelationships],
                    ['anniversary', copy.showAnniversary],
                    ['ministryInterests', copy.showInterests],
                    ['photo', copy.showPhoto],
                    ['churchStatus', copy.showChurchStatus],
                    ['churchRoles', copy.showChurchRoles],
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

function ProfileSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.profileCard}>
      <div className={classes.cardHeader}>
        <Title order={3}>{title}</Title>
        <Text c="dimmed" size="sm" mt={4}>
          {description}
        </Text>
      </div>
      <Stack mt="xl" gap="lg">
        {children}
      </Stack>
    </Paper>
  );
}

function ReadOnlyValue({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text size="xs" c="dimmed" fw={700}>
        {label}
      </Text>
      <Text mt={3}>{value}</Text>
    </Box>
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
        {isPhotoWorkerConfigured() ? (
          <Stack gap="xs" className={classes.photoInput}>
            <AvatarCropper
              busy={busy}
              copy={copy}
              triggerLabel={url ? copy.replacePhoto : copy.choosePhoto}
              onError={(message) =>
                void run(async () => {
                  throw new Error(message);
                })
              }
              onSubmit={async (source, position) => {
                let succeeded = false;
                await run(async () => {
                  const prepared = await prepareAvatar(source, position);
                  await uploadMyAvatar(prepared);
                  setUrl(await fetchAvatar(uid, 'pending'));
                  succeeded = true;
                }, copy.pendingPhoto);
                return succeeded;
              }}
            />
          </Stack>
        ) : null}
      </Group>
      {isPhotoWorkerConfigured() ? (
        url ? (
          <Group justify="center" mt="md">
            <Button color="red" variant="subtle" onClick={() => setRemoveOpened(true)}>
              {copy.removePhoto}
            </Button>
          </Group>
        ) : null
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
  const [households, setHouseholds] = useState<HouseholdDirectoryEntry[]>([]);
  const [relationships, setRelationships] = useState<RelationshipDirectoryEntry[]>([]);
  const [cursor, setCursor] =
    useState<Awaited<ReturnType<typeof loadDirectoryPage>>['cursor']>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const load = async (next = false) => {
    setLoading(true);
    const result = await loadDirectoryPage(next ? cursor : null);
    const connections = await loadDirectoryConnections(result.items.map((item) => item.uid));
    setEntries((current) => (next ? [...current, ...result.items] : result.items));
    setHouseholds((current) =>
      next ? [...current, ...connections.households] : connections.households
    );
    setRelationships((current) => {
      const values = next ? [...current, ...connections.relationships] : connections.relationships;
      return [...new Map(values.map((item) => [item.id, item])).values()];
    });
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
            <MemberCard
              key={entry.uid}
              entry={entry}
              householdMembers={(() => {
                const householdId = households.find((item) => item.uid === entry.uid)?.householdId;
                return householdId
                  ? households.filter(
                      (item) => item.householdId === householdId && item.uid !== entry.uid
                    )
                  : [];
              })()}
              relationships={relationships.filter((item) => item.memberUids.includes(entry.uid))}
            />
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

function MemberCard({
  entry,
  householdMembers,
  relationships,
}: {
  entry: DirectoryEntry;
  householdMembers: HouseholdDirectoryEntry[];
  relationships: RelationshipDirectoryEntry[];
}) {
  const locale = useLocale();
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
        {entry.churchStatus || entry.churchRoles.length ? (
          <Group gap="xs" mb="xs">
            {entry.churchStatus ? (
              <Badge color="moss" variant="light">
                {optionLabel(CHURCH_STATUS_OPTIONS, entry.churchStatus, locale)}
              </Badge>
            ) : null}
            {entry.churchRoles.map((role) => (
              <Badge key={role} color="brand" variant="outline">
                {optionLabel(CHURCH_ROLE_OPTIONS, role, locale)}
              </Badge>
            ))}
          </Group>
        ) : null}
        {entry.email ? (
          <Text component="a" href={`mailto:${entry.email}`} size="sm">
            {entry.email}
          </Text>
        ) : null}
        {entry.phone ? (
          <Text component="a" href={`tel:${entry.phone}`} size="sm">
            {formatPhone(entry.phone)}
          </Text>
        ) : null}
        {entry.birthday ? <Text size="sm">{formatBirthday(entry.birthday, locale)}</Text> : null}
        {entry.address ? (
          <Text size="sm">
            {formatAddress(entry.address).map((line) => (
              <span key={line} className={classes.addressLine}>
                {line}
              </span>
            ))}
          </Text>
        ) : null}
        {entry.household ? (
          <Text size="sm" className={classes.preserveLines}>
            {entry.household}
          </Text>
        ) : null}
        {householdMembers.length ? (
          <Text size="sm">{householdMembers.map((member) => member.displayName).join(', ')}</Text>
        ) : null}
        {relationships.map((relationship) => {
          const index = relationship.memberUids[0] === entry.uid ? 0 : 1;
          return (
            <Text key={relationship.id} size="sm">
              {relationship.memberNames[index === 0 ? 1 : 0]} ·{' '}
              {index === 0 ? relationship.typeAtoB : relationship.typeBtoA}
            </Text>
          );
        })}
        {entry.ministryInterests.length ? (
          <Text size="sm" c="dimmed" mt="xs">
            {entry.ministryInterests
              .map((interest) =>
                interest === 'other'
                  ? entry.otherMinistryInterest ||
                    optionLabel(MINISTRY_INTEREST_OPTIONS, interest, locale)
                  : optionLabel(MINISTRY_INTEREST_OPTIONS, interest, locale)
              )
              .join(' · ')}
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
    (access.role === 'admin' ? loadAdminGroups() : loadMyGroups(access.uid)).then((items) =>
      setGroups(items.filter((item) => item.status !== 'deleted'))
    );
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
  const { groupId = '' } = useParams();
  const navigate = useNavigate();
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
          {access.role === 'admin' && portalGroup.status !== 'deleted' ? (
            <Button
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={() => {
                if (window.confirm(copy.deleteGroupConfirm)) {
                  run(async () => {
                    await deleteGroup(access, portalGroup);
                    navigate(getLocalizedPath('memberGroups', locale));
                  });
                }
              }}
            >
              {copy.deleteGroup}
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
  const [editing, setEditing] = useState<GroupEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GroupEvent | null>(null);
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
          <Button
            size="xs"
            onClick={() => {
              setEditing(null);
              setTitle('');
              setDescription('');
              setLocation('');
              setStarts(toInputDate(new Date()));
              setEnds(toInputDate(new Date(Date.now() + 3600000)));
              setAllDay(false);
              setOpened(true);
            }}
          >
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
            {canEdit ? (
              <Group gap="xs" mt="xs">
                <Button
                  variant="subtle"
                  size="xs"
                  leftSection={<IconEdit size={14} />}
                  onClick={() => {
                    setEditing(item);
                    setTitle(item.title);
                    setDescription(item.description);
                    setLocation(item.location);
                    setStarts(toInputDate(item.startsAt));
                    setEnds(toInputDate(item.endsAt));
                    setAllDay(item.allDay);
                    setOpened(true);
                  }}
                >
                  {copy.edit}
                </Button>
                <Button
                  color="red"
                  variant="subtle"
                  size="xs"
                  onClick={() => setDeleteTarget(item)}
                >
                  {copy.deleteAction}
                </Button>
              </Group>
            ) : null}
          </Paper>
        ))}
        {events.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
      </Stack>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setEditing(null);
        }}
        title={editing ? copy.editEvent : copy.newEvent}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            run(async () => {
              await saveEvent(access, {
                id: editing?.id,
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
              setEditing(null);
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
      <Modal
        opened={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={copy.deleteAction}
      >
        <Stack>
          <Text>{copy.deleteEventConfirm}</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteTarget(null)}>
              {copy.cancel}
            </Button>
            <Button
              color="red"
              loading={busy}
              onClick={() =>
                run(async () => {
                  if (deleteTarget) {
                    await deleteEvent(access, deleteTarget);
                  }
                  setDeleteTarget(null);
                  await reload();
                })
              }
            >
              {copy.deleteAction}
            </Button>
          </Group>
        </Stack>
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
  const [editing, setEditing] = useState<GroupUpdate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GroupUpdate | null>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [publishedAt, setPublishedAt] = useState(toInputDate(new Date()));
  const [expiresAt, setExpiresAt] = useState('');
  const [important, setImportant] = useState(false);
  const [pinned, setPinned] = useState(false);
  const openNew = () => {
    setEditing(null);
    setTitle('');
    setSummary('');
    setBody('');
    setPublishedAt(toInputDate(new Date()));
    setExpiresAt('');
    setImportant(false);
    setPinned(false);
    setOpened(true);
  };
  const openEdit = (item: GroupUpdate) => {
    setEditing(item);
    setTitle(item.title);
    setSummary(item.summary);
    setBody(item.body);
    setPublishedAt(toInputDate(item.publishedAt ?? new Date()));
    setExpiresAt(item.expiresAt ? toInputDate(item.expiresAt) : '');
    setImportant(item.important);
    setPinned(item.pinned);
    setOpened(true);
  };
  return (
    <Paper withBorder p="xl">
      <Group justify="space-between">
        <Title order={3}>{copy.announcements}</Title>
        {canEdit ? (
          <Button size="xs" onClick={openNew}>
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
            {canEdit ? (
              <Group gap="xs" mt="xs">
                <Button variant="subtle" size="xs" onClick={() => openEdit(item)}>
                  {copy.edit}
                </Button>
                <Button
                  color="red"
                  variant="subtle"
                  size="xs"
                  onClick={() => setDeleteTarget(item)}
                >
                  {copy.deleteAction}
                </Button>
              </Group>
            ) : null}
          </Paper>
        ))}
        {updates.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
      </Stack>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setEditing(null);
        }}
        title={editing ? copy.editUpdate : copy.newUpdate}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            run(async () => {
              await saveUpdate(access, {
                id: editing?.id,
                groupId: portalGroup.id,
                groupName: portalGroup.name,
                title,
                summary,
                body,
                visibility: portalGroup.visibility,
                status: 'published',
                pinned,
                important,
                publishedAt: new Date(publishedAt),
                expiresAt: expiresAt ? new Date(expiresAt) : undefined,
              });
              await reload();
              setOpened(false);
              setEditing(null);
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
              label={copy.summary}
              value={summary}
              maxLength={300}
              onChange={(event) => setSummary(event.currentTarget.value)}
            />
            <Textarea
              label={copy.body}
              minRows={5}
              value={body}
              onChange={(event) => setBody(event.currentTarget.value)}
            />
            <TextInput
              type="datetime-local"
              label={copy.publishDate}
              required
              value={publishedAt}
              onChange={(event) => setPublishedAt(event.currentTarget.value)}
            />
            <TextInput
              type="datetime-local"
              label={copy.expires}
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.currentTarget.value)}
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
      <Modal
        opened={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={copy.deleteAction}
      >
        <Stack>
          <Text>{copy.deleteUpdateConfirm}</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteTarget(null)}>
              {copy.cancel}
            </Button>
            <Button
              color="red"
              loading={busy}
              onClick={() =>
                run(async () => {
                  if (deleteTarget) {
                    await deleteUpdate(access, deleteTarget);
                  }
                  setDeleteTarget(null);
                  await reload();
                })
              }
            >
              {copy.deleteAction}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Paper>
  );
}

function CalendarPanel({ copy, access }: { copy: typeof copyByLocale.en; access: MemberAccess }) {
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [groups, setGroups] = useState<PortalGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [groupFilter, setGroupFilter] = useState('all');
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<GroupEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GroupEvent | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [starts, setStarts] = useState(toInputDate(new Date()));
  const [ends, setEnds] = useState(toInputDate(new Date(Date.now() + 3600000)));
  const [allDay, setAllDay] = useState(false);
  const [eventGroupId, setEventGroupId] = useState('');
  const [busy, setBusy] = useState(false);
  const range = useMemo(() => {
    const from = new Date(month);
    const to = new Date(month);
    to.setMonth(to.getMonth() + 1);
    return { from, to };
  }, [month]);
  const reload = async () => {
    setLoading(true);
    const [groupIds, nextGroups] = await Promise.all([
      loadMembershipGroupIds(access.uid),
      access.role === 'admin' ? loadAdminGroups() : loadMyGroups(access.uid),
    ]);
    const nextEvents = await loadAccessibleEvents(access, groupIds, range.from, range.to, 100);
    setGroups(nextGroups.filter((group) => group.status === 'active'));
    setEvents(nextEvents);
    setLoading(false);
  };
  useEffect(() => {
    reload();
  }, [access.uid, access.role, range.from.getTime()]);
  const visibleEvents = events.filter(
    (event) => groupFilter === 'all' || event.groupId === groupFilter
  );
  const startOffset = range.from.getDay();
  const gridStart = new Date(range.from);
  gridStart.setDate(gridStart.getDate() - startOffset);
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(day.getDate() + index);
    return day;
  });
  const openNew = (date = new Date()) => {
    const start = new Date(date);
    start.setHours(9, 0, 0, 0);
    setEditing(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setStarts(toInputDate(start));
    setEnds(toInputDate(new Date(start.getTime() + 3600000)));
    setAllDay(false);
    setEventGroupId('');
    setOpened(true);
  };
  const openEdit = (event: GroupEvent) => {
    setEditing(event);
    setTitle(event.title);
    setDescription(event.description);
    setLocation(event.location);
    setStarts(toInputDate(event.startsAt));
    setEnds(toInputDate(event.endsAt));
    setAllDay(event.allDay);
    setEventGroupId(event.groupId);
    setOpened(true);
  };
  const saveCalendarEvent = async () => {
    const selectedGroup = groups.find((group) => group.id === eventGroupId);
    setBusy(true);
    try {
      await saveEvent(access, {
        id: editing?.id,
        groupId: eventGroupId,
        groupName: selectedGroup?.name ?? '',
        title,
        description,
        location,
        startsAt: new Date(starts),
        endsAt: new Date(ends),
        allDay,
        visibility: selectedGroup?.visibility ?? 'allApproved',
        status: editing?.status ?? 'scheduled',
      });
      setOpened(false);
      setEditing(null);
      await reload();
    } finally {
      setBusy(false);
    }
  };
  return (
    <Stack>
      <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
        <Group justify="space-between" align="flex-end">
          <Box>
            <Title order={2}>{copy.calendar}</Title>
            <Text c="dimmed">
              {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </Text>
          </Box>
          <Group>
            {access.role === 'admin' ? (
              <Button onClick={() => openNew()}>{copy.newEvent}</Button>
            ) : null}
            <Button
              variant="default"
              aria-label={copy.previousMonth}
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            >
              <IconChevronLeft size={18} />
            </Button>
            <Button
              variant="light"
              onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
            >
              {copy.today}
            </Button>
            <Button
              variant="default"
              aria-label={copy.nextMonth}
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            >
              <IconChevronRight size={18} />
            </Button>
          </Group>
        </Group>
        <Select
          mt="md"
          label={copy.groups}
          value={groupFilter}
          allowDeselect={false}
          data={[
            { value: 'all', label: copy.allOptions },
            { value: '', label: copy.churchWide },
            ...groups.map((group) => ({ value: group.id, label: group.name })),
          ]}
          onChange={(value) => setGroupFilter(value ?? 'all')}
        />
      </Paper>
      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : (
        <>
          <div className={classes.calendarGrid} role="grid" aria-label={copy.calendar}>
            {Array.from({ length: 7 }, (_, index) => {
              const date = new Date(2026, 0, 4 + index);
              return (
                <Text key={index} role="columnheader" className={classes.calendarWeekday}>
                  {date.toLocaleDateString(undefined, { weekday: 'short' })}
                </Text>
              );
            })}
            {days.map((day) => {
              const dayEvents = visibleEvents.filter(
                (event) => event.startsAt.toDateString() === day.toDateString()
              );
              return (
                <div
                  key={day.toISOString()}
                  className={classes.calendarDay}
                  data-outside={day.getMonth() !== month.getMonth() || undefined}
                  role="gridcell"
                >
                  <Group justify="space-between">
                    <Text fw={700} size="sm">
                      {day.getDate()}
                    </Text>
                    {access.role === 'admin' && day.getMonth() === month.getMonth() ? (
                      <Button
                        variant="subtle"
                        size="compact-xs"
                        aria-label={`${copy.newEvent} ${day.toLocaleDateString()}`}
                        onClick={() => openNew(day)}
                      >
                        +
                      </Button>
                    ) : null}
                  </Group>
                  <Stack gap={4} mt={4}>
                    {dayEvents.map((event) => (
                      <Button
                        key={event.id}
                        variant="light"
                        size="compact-xs"
                        className={classes.calendarEvent}
                        onClick={() => (access.role === 'admin' ? openEdit(event) : undefined)}
                      >
                        {event.allDay
                          ? ''
                          : event.startsAt.toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}{' '}
                        {event.title}
                      </Button>
                    ))}
                  </Stack>
                </div>
              );
            })}
          </div>
          <Stack className={classes.calendarAgenda}>
            {visibleEvents.map((event) => (
              <Paper key={event.id} withBorder p="md">
                <Text fw={800}>{event.title}</Text>
                <Text size="sm" c="dimmed">
                  {event.startsAt.toLocaleString()}
                </Text>
                {event.groupName ? <Badge mt="xs">{event.groupName}</Badge> : null}
                <Group mt="xs">
                  <Button size="xs" variant="subtle" onClick={() => downloadIcs(event)}>
                    {copy.addCalendar}
                  </Button>
                  {access.role === 'admin' ? (
                    <Button size="xs" variant="subtle" onClick={() => openEdit(event)}>
                      {copy.edit}
                    </Button>
                  ) : null}
                </Group>
              </Paper>
            ))}
            {visibleEvents.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
          </Stack>
        </>
      )}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? copy.editEvent : copy.newEvent}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void saveCalendarEvent();
          }}
        >
          <Stack>
            <Select
              label={copy.groups}
              value={eventGroupId}
              allowDeselect={false}
              data={[
                { value: '', label: copy.churchWide },
                ...groups.map((group) => ({ value: group.id, label: group.name })),
              ]}
              onChange={(value) => setEventGroupId(value ?? '')}
            />
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
              required
              value={starts}
              onChange={(event) => setStarts(event.currentTarget.value)}
            />
            <TextInput
              type="datetime-local"
              label={copy.ends}
              required
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
            {editing ? (
              <Button
                color="red"
                variant="light"
                onClick={() => {
                  setOpened(false);
                  setDeleteTarget(editing);
                }}
              >
                {copy.deleteAction}
              </Button>
            ) : null}
          </Stack>
        </form>
      </Modal>
      <Modal
        opened={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={copy.deleteAction}
      >
        <Stack>
          <Text>{copy.deleteEventConfirm}</Text>
          <Button
            color="red"
            loading={busy}
            onClick={async () => {
              if (!deleteTarget) {
                return;
              }
              setBusy(true);
              try {
                await deleteEvent(access, deleteTarget);
                setDeleteTarget(null);
                await reload();
              } finally {
                setBusy(false);
              }
            }}
          >
            {copy.deleteAction}
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}

function UpdatesPanel({ copy, access }: { copy: typeof copyByLocale.en; access: MemberAccess }) {
  const [updates, setUpdates] = useState<GroupUpdate[]>([]);
  const [groups, setGroups] = useState<PortalGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<GroupUpdate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GroupUpdate | null>(null);
  const [groupId, setGroupId] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [important, setImportant] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [publishedAt, setPublishedAt] = useState(toInputDate(new Date()));
  const [expiresAt, setExpiresAt] = useState('');
  const reload = async () => {
    setLoading(true);
    const [ids, nextGroups] = await Promise.all([
      loadMembershipGroupIds(access.uid),
      access.role === 'admin' ? loadAdminGroups() : loadMyGroups(access.uid),
    ]);
    setGroups(nextGroups.filter((group) => group.status === 'active'));
    setUpdates(
      access.role === 'admin'
        ? await loadAdminUpdates(100)
        : await loadAccessibleUpdates(access, ids, 50)
    );
    setLoading(false);
  };
  useEffect(() => {
    reload();
  }, [access.uid, access.role]);
  const openEditor = (item?: GroupUpdate) => {
    setEditing(item ?? null);
    setGroupId(item?.groupId ?? '');
    setTitle(item?.title ?? '');
    setSummary(item?.summary ?? '');
    setBody(item?.body ?? '');
    setImportant(item?.important ?? false);
    setPinned(item?.pinned ?? false);
    setPublishedAt(toInputDate(item?.publishedAt ?? new Date()));
    setExpiresAt(item?.expiresAt ? toInputDate(item.expiresAt) : '');
    setOpened(true);
  };
  const saveAnnouncement = async () => {
    const group = groups.find((item) => item.id === groupId);
    setBusy(true);
    try {
      await saveUpdate(access, {
        id: editing?.id,
        groupId,
        groupName: group?.name ?? '',
        title,
        summary,
        body,
        visibility: group?.visibility ?? 'allApproved',
        status: 'published',
        important,
        pinned,
        publishedAt: new Date(publishedAt),
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      });
      setOpened(false);
      await reload();
    } finally {
      setBusy(false);
    }
  };
  return (
    <Stack>
      <Paper withBorder p="xl">
        <Group justify="space-between">
          <Title order={2}>{copy.updates}</Title>
          {access.role === 'admin' ? (
            <Button onClick={() => openEditor()}>{copy.newUpdate}</Button>
          ) : null}
        </Group>
      </Paper>
      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : (
        <Stack mt="lg">
          {updates.map((item) => (
            <Paper key={item.id} withBorder p="lg">
              <Group>
                <Badge>{item.groupName || copy.churchWide}</Badge>
                {item.important ? <Badge color="red">{copy.important}</Badge> : null}
                {item.pinned ? <Badge variant="light">{copy.pinned}</Badge> : null}
              </Group>
              <Title order={3} mt="sm">
                {item.title}
              </Title>
              <Text className={classes.preserveLines} mt="sm">
                {item.body}
              </Text>
              {access.role === 'admin' ? (
                <Group mt="md">
                  <Button variant="subtle" size="xs" onClick={() => openEditor(item)}>
                    {copy.edit}
                  </Button>
                  <Button
                    color="red"
                    variant="subtle"
                    size="xs"
                    onClick={() => setDeleteTarget(item)}
                  >
                    {copy.deleteAction}
                  </Button>
                </Group>
              ) : null}
            </Paper>
          ))}
          {updates.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
        </Stack>
      )}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? copy.editUpdate : copy.newUpdate}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void saveAnnouncement();
          }}
        >
          <Stack>
            <Select
              label={copy.groups}
              value={groupId}
              allowDeselect={false}
              data={[
                { value: '', label: copy.churchWide },
                ...groups.map((group) => ({ value: group.id, label: group.name })),
              ]}
              onChange={(value) => setGroupId(value ?? '')}
            />
            <TextInput
              label={copy.titleLabel}
              required
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
            <Textarea
              label={copy.summary}
              maxLength={300}
              value={summary}
              onChange={(event) => setSummary(event.currentTarget.value)}
            />
            <Textarea
              label={copy.body}
              required
              minRows={6}
              value={body}
              onChange={(event) => setBody(event.currentTarget.value)}
            />
            <TextInput
              type="datetime-local"
              label={copy.publishDate}
              required
              value={publishedAt}
              onChange={(event) => setPublishedAt(event.currentTarget.value)}
            />
            <TextInput
              type="datetime-local"
              label={copy.expires}
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.currentTarget.value)}
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
      <Modal
        opened={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={copy.deleteAction}
      >
        <Stack>
          <Text>{copy.deleteUpdateConfirm}</Text>
          <Button
            color="red"
            loading={busy}
            onClick={async () => {
              if (!deleteTarget) {
                return;
              }
              setBusy(true);
              try {
                await deleteUpdate(access, deleteTarget);
                setDeleteTarget(null);
                await reload();
              } finally {
                setBusy(false);
              }
            }}
          >
            {copy.deleteAction}
          </Button>
        </Stack>
      </Modal>
    </Stack>
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
  const locale = useLocale();
  const [records, setRecords] = useState<AdminMemberRecord[]>([]);
  const [search, setSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState<string>('all');
  const [churchStatusFilter, setChurchStatusFilter] = useState<string>('all');
  const [churchRoleFilter, setChurchRoleFilter] = useState<string>('all');
  const [ministryFilter, setMinistryFilter] = useState<string>('all');
  const [photos, setPhotos] = useState<AvatarMetadata[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [tab, setTab] = useState<string>('members');
  const reload = async () => {
    if (tab === 'members') {
      setRecords(await loadAdminMemberRecords());
    } else if (tab === 'photos') {
      setPhotos(await loadAvatarModeration());
    } else if (tab === 'audit') {
      setAudits(await loadAuditLogs());
    }
  };
  useEffect(() => {
    reload();
  }, [tab]);
  const normalizedSearch = search
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
  const members = records.filter(
    (record) =>
      (accessFilter === 'all' || record.access.status === accessFilter) &&
      (churchStatusFilter === 'all' || record.church.churchStatus === churchStatusFilter) &&
      (churchRoleFilter === 'all' ||
        record.church.churchRoles.includes(churchRoleFilter as ChurchRole)) &&
      (ministryFilter === 'all' ||
        record.profile.ministryInterests.includes(ministryFilter as MinistryInterestId)) &&
      (!normalizedSearch ||
        searchableMemberText(record.profile, record.church, locale).includes(normalizedSearch))
  );
  return (
    <Stack>
      <Title order={2}>{copy.admin}</Title>
      <Text c="dimmed">{copy.adminHelp}</Text>
      <Tabs value={tab} onChange={(value) => setTab(value || 'members')}>
        <Tabs.List>
          <Tabs.Tab value="members">{copy.members}</Tabs.Tab>
          <Tabs.Tab value="households">{copy.householdsAdmin}</Tabs.Tab>
          <Tabs.Tab value="photos">{copy.photos}</Tabs.Tab>
          <Tabs.Tab value="audit">{copy.audit}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="members" pt="lg">
          <Paper withBorder p="lg" mb="lg">
            <TextInput
              label={copy.searchMembers}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mt="md">
              <Select
                label={copy.accessStatusFilter}
                value={accessFilter}
                allowDeselect={false}
                data={[
                  { value: 'all', label: copy.allOptions },
                  ...(
                    [
                      'onboarding',
                      'pending',
                      'approved',
                      'rejected',
                      'deactivated',
                      'banned',
                      'deletionRequested',
                      'deleted',
                    ] as PortalAccessStatus[]
                  ).map((value) => ({ value, label: value })),
                ]}
                onChange={(value) => setAccessFilter(value || 'all')}
              />
              <Select
                label={copy.churchStatusFilter}
                value={churchStatusFilter}
                allowDeselect={false}
                data={[
                  { value: 'all', label: copy.allOptions },
                  ...optionData(CHURCH_STATUS_OPTIONS, locale),
                ]}
                onChange={(value) => setChurchStatusFilter(value || 'all')}
              />
              <Select
                label={copy.churchRoleFilter}
                value={churchRoleFilter}
                allowDeselect={false}
                data={[
                  { value: 'all', label: copy.allOptions },
                  ...optionData(CHURCH_ROLE_OPTIONS, locale),
                ]}
                onChange={(value) => setChurchRoleFilter(value || 'all')}
              />
              <Select
                label={copy.ministryFilter}
                value={ministryFilter}
                searchable
                allowDeselect={false}
                data={[
                  { value: 'all', label: copy.allOptions },
                  ...optionData(MINISTRY_INTEREST_OPTIONS, locale),
                ]}
                onChange={(value) => setMinistryFilter(value || 'all')}
              />
            </SimpleGrid>
          </Paper>
          <Stack>
            {members.map((record) => (
              <AdminMemberCard
                key={record.access.uid}
                {...{ copy, access, record, busy, run, reload }}
              />
            ))}
            {members.length === 0 ? <Text c="dimmed">{copy.empty}</Text> : null}
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="households" pt="lg">
          <HouseholdsAdminPanel {...{ copy, access, busy, run }} />
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

function HouseholdsAdminPanel({
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
  const locale = useLocale();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [relationships, setRelationships] = useState<MemberRelationship[]>([]);
  const [records, setRecords] = useState<AdminMemberRecord[]>([]);
  const [householdOpened, setHouseholdOpened] = useState(false);
  const [relationshipOpened, setRelationshipOpened] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [editingRelationship, setEditingRelationship] = useState<MemberRelationship | null>(null);
  const [householdName, setHouseholdName] = useState('');
  const [householdMembers, setHouseholdMembers] = useState<string[]>([]);
  const [personA, setPersonA] = useState('');
  const [personB, setPersonB] = useState('');
  const [relationshipTypeValue, setRelationshipTypeValue] = useState<RelationshipType>('spouse');
  const [relationshipAudience, setRelationshipAudience] =
    useState<RelationshipAudience>('linkedOnly');
  const [relationshipHouseholdId, setRelationshipHouseholdId] = useState('');
  const [anniversaryMonth, setAnniversaryMonth] = useState('');
  const [anniversaryDay, setAnniversaryDay] = useState('');
  const reload = async () => {
    const [nextHouseholds, nextRelationships, nextRecords] = await Promise.all([
      loadAdminHouseholds(),
      loadAdminRelationships(),
      loadAdminMemberRecords(),
    ]);
    setHouseholds(nextHouseholds);
    setRelationships(nextRelationships);
    setRecords(nextRecords.filter((record) => record.access.status === 'approved'));
  };
  useEffect(() => {
    void reload();
  }, []);
  const memberOptions = records.map((record) => ({
    value: record.access.uid,
    label: record.profile.displayName || record.access.displayName,
  }));
  const memberName = (uid: string) =>
    memberOptions.find((option) => option.value === uid)?.label ?? '';
  const openHousehold = (household?: Household) => {
    setEditingHousehold(household ?? null);
    setHouseholdName(household?.name ?? '');
    setHouseholdMembers(household?.memberUids ?? []);
    setHouseholdOpened(true);
  };
  const openRelationship = (relationship?: MemberRelationship) => {
    setEditingRelationship(relationship ?? null);
    setPersonA(relationship?.memberUids[0] ?? '');
    setPersonB(relationship?.memberUids[1] ?? '');
    setRelationshipTypeValue(relationship?.typeAtoB ?? 'spouse');
    setRelationshipAudience(relationship?.audience ?? 'linkedOnly');
    setRelationshipHouseholdId(relationship?.householdId ?? '');
    setAnniversaryMonth(relationship?.anniversary ? String(relationship.anniversary.month) : '');
    setAnniversaryDay(relationship?.anniversary ? String(relationship.anniversary.day) : '');
    setRelationshipOpened(true);
  };
  return (
    <Stack>
      <Text c="dimmed">{copy.householdsAdminHelp}</Text>
      <Group>
        <Button onClick={() => openHousehold()}>{copy.newHousehold}</Button>
        <Button variant="light" onClick={() => openRelationship()}>
          {copy.newRelationship}
        </Button>
      </Group>
      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <Stack>
          <Title order={3}>{copy.household}</Title>
          {households
            .filter((item) => item.status === 'active')
            .map((household) => (
              <Paper key={household.id} withBorder p="md">
                <Text fw={800}>{household.name}</Text>
                <Text size="sm">{household.memberNames.join(', ')}</Text>
                <Group mt="xs">
                  <Button size="xs" variant="subtle" onClick={() => openHousehold(household)}>
                    {copy.edit}
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    variant="subtle"
                    onClick={() =>
                      run(async () => {
                        await saveHousehold(access, { ...household, status: 'deleted' });
                        await reload();
                      })
                    }
                  >
                    {copy.deleteAction}
                  </Button>
                </Group>
              </Paper>
            ))}
        </Stack>
        <Stack>
          <Title order={3}>{copy.relationshipType}</Title>
          {relationships
            .filter((item) => item.status === 'active')
            .map((relationship) => (
              <Paper key={relationship.id} withBorder p="md">
                <Text fw={800}>{relationship.memberNames.join(' · ')}</Text>
                <Text size="sm">{relationship.typeAtoB}</Text>
                {relationship.anniversary ? (
                  <Text size="sm">
                    {copy.anniversary}: {formatBirthday(relationship.anniversary, locale)}
                  </Text>
                ) : null}
                <Group mt="xs">
                  <Button size="xs" variant="subtle" onClick={() => openRelationship(relationship)}>
                    {copy.edit}
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    variant="subtle"
                    onClick={() =>
                      run(async () => {
                        await saveRelationship(access, { ...relationship, status: 'deleted' });
                        await reload();
                      })
                    }
                  >
                    {copy.deleteAction}
                  </Button>
                </Group>
              </Paper>
            ))}
        </Stack>
      </SimpleGrid>

      <Modal
        opened={householdOpened}
        onClose={() => setHouseholdOpened(false)}
        title={editingHousehold ? copy.edit : copy.newHousehold}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void run(async () => {
              await saveHousehold(access, {
                id: editingHousehold?.id ?? '',
                name: householdName,
                memberUids: householdMembers,
                memberNames: householdMembers.map(memberName),
                status: 'active',
              });
              setHouseholdOpened(false);
              await reload();
            });
          }}
        >
          <Stack>
            <TextInput
              label={copy.householdName}
              required
              value={householdName}
              onChange={(event) => setHouseholdName(event.currentTarget.value)}
            />
            <MultiSelect
              label={copy.members}
              required
              searchable
              data={memberOptions}
              value={householdMembers}
              onChange={setHouseholdMembers}
            />
            <Button type="submit" loading={busy}>
              {copy.save}
            </Button>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={relationshipOpened}
        onClose={() => setRelationshipOpened(false)}
        title={editingRelationship ? copy.edit : copy.newRelationship}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void run(async () => {
              const anniversary =
                anniversaryMonth && anniversaryDay
                  ? { month: Number(anniversaryMonth), day: Number(anniversaryDay) }
                  : null;
              await saveRelationship(access, {
                id: editingRelationship?.id ?? '',
                memberUids: [personA, personB],
                memberNames: [memberName(personA), memberName(personB)],
                typeAtoB: relationshipTypeValue,
                typeBtoA:
                  relationshipTypeValue === 'parent'
                    ? 'child'
                    : relationshipTypeValue === 'child'
                      ? 'parent'
                      : relationshipTypeValue,
                householdId: relationshipHouseholdId,
                audience: relationshipAudience,
                anniversary,
                status: 'active',
              });
              setRelationshipOpened(false);
              await reload();
            });
          }}
        >
          <Stack>
            <Select
              label={copy.personA}
              required
              searchable
              data={memberOptions}
              value={personA}
              onChange={(value) => setPersonA(value ?? '')}
            />
            <Select
              label={copy.personB}
              required
              searchable
              data={memberOptions.filter((option) => option.value !== personA)}
              value={personB}
              onChange={(value) => setPersonB(value ?? '')}
            />
            <Select
              label={copy.relationshipType}
              value={relationshipTypeValue}
              allowDeselect={false}
              data={[
                'spouse',
                'partner',
                'parent',
                'child',
                'sibling',
                'familyMember',
                'householdMember',
                'other',
              ]}
              onChange={(value) => setRelationshipTypeValue((value ?? 'other') as RelationshipType)}
            />
            <Select
              label={copy.relationshipAudience}
              value={relationshipAudience}
              allowDeselect={false}
              data={[
                { value: 'linkedOnly', label: copy.linkedOnly },
                { value: 'allApproved', label: copy.allOptions },
              ]}
              onChange={(value) =>
                setRelationshipAudience((value ?? 'linkedOnly') as RelationshipAudience)
              }
            />
            <Select
              label={copy.household}
              clearable
              data={households
                .filter((household) => household.status === 'active')
                .map((household) => ({ value: household.id, label: household.name }))}
              value={relationshipHouseholdId}
              onChange={(value) => setRelationshipHouseholdId(value ?? '')}
            />
            <SimpleGrid cols={2}>
              <Select
                label={`${copy.anniversary} ${copy.month}`}
                clearable
                data={Array.from({ length: 12 }, (_, index) => String(index + 1))}
                value={anniversaryMonth}
                onChange={(value) => setAnniversaryMonth(value ?? '')}
              />
              <Select
                label={`${copy.anniversary} ${copy.day}`}
                clearable
                data={Array.from({ length: 31 }, (_, index) => String(index + 1))}
                value={anniversaryDay}
                onChange={(value) => setAnniversaryDay(value ?? '')}
              />
            </SimpleGrid>
            <Button
              type="submit"
              loading={busy}
              disabled={!personA || !personB || personA === personB}
            >
              {copy.save}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}

function AdminMemberCard({
  copy,
  access,
  record,
  busy,
  run,
  reload,
}: {
  copy: typeof copyByLocale.en;
  access: MemberAccess;
  record: AdminMemberRecord;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  reload: () => Promise<void>;
}) {
  const member = record.access;
  const locale = useLocale();
  const action = (next: PortalAccessStatus, label: string) => (
    <Button
      size="xs"
      color={next === 'approved' || next === 'deactivated' ? 'green' : 'red'}
      variant={next === 'approved' ? 'filled' : 'light'}
      disabled={member.uid === access.uid}
      loading={busy}
      onClick={() => {
        if (next === 'approved' || window.confirm(`${label}: ${member.displayName}?`)) {
          run(async () => {
            await changePortalAccessStatus(access, member, next);
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
            <Badge variant="outline">
              {copy.portalPermission}: {member.role}
            </Badge>
            {record.church.churchStatus ? (
              <Badge color="moss" variant="light">
                {optionLabel(CHURCH_STATUS_OPTIONS, record.church.churchStatus, locale)}
              </Badge>
            ) : null}
            {record.church.churchRoles.map((role) => (
              <Badge key={role} color="brand" variant="outline">
                {optionLabel(CHURCH_ROLE_OPTIONS, role, locale)}
              </Badge>
            ))}
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
                    await changePortalPermission(
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
      {member.status !== 'deleted' ? (
        <>
          <Group mt="md">
            <AdminProfileEditor
              copy={copy}
              actor={access}
              initialProfile={record.profile}
              busy={busy}
              run={run}
              reload={reload}
            />
            <AdminChurchRecordEditor
              copy={copy}
              actor={access}
              initialMetadata={record.church}
              busy={busy}
              run={run}
              reload={reload}
            />
            <AdminNotesEditor copy={copy} actor={access} uid={member.uid} busy={busy} run={run} />
          </Group>
          {member.status === 'approved' ? (
            <AdminPhotoUpload copy={copy} uid={member.uid} busy={busy} run={run} />
          ) : null}
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
  const locale = useLocale();
  const [opened, setOpened] = useState(false);
  const [profile, setProfile] = useState<DirectoryProfile | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const open = async () => {
    setProfile(
      (await loadOwnProfile(member.uid, true)) ?? emptyDirectoryProfile(member.uid, member.email)
    );
    setRejecting(false);
    setReason('');
    setOpened(true);
  };
  const decide = (status: 'approved' | 'rejected', statusReason = '') =>
    run(async () => {
      await changePortalAccessStatus(actor, member, status, statusReason);
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
                <Text>
                  {profile.ministryInterests
                    .map((interest) =>
                      interest === 'other'
                        ? profile.otherMinistryInterest
                        : optionLabel(MINISTRY_INTEREST_OPTIONS, interest, locale)
                    )
                    .filter(Boolean)
                    .join(', ') || copy.empty}
                </Text>
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
  initialProfile,
  busy,
  run,
  reload,
}: {
  copy: typeof copyByLocale.en;
  actor: MemberAccess;
  initialProfile: DirectoryProfile;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  reload: () => Promise<void>;
}) {
  const locale = useLocale();
  const [opened, setOpened] = useState(false);
  const [profile, setProfile] = useState<DirectoryProfile>(initialProfile);
  const open = () => {
    setProfile(initialProfile);
    setOpened(true);
  };
  const update = (next: Partial<DirectoryProfile>) => {
    setProfile({ ...profile, ...next });
  };
  const visibility = (key: keyof DirectoryProfile['visibility'], checked: boolean) => {
    update({ visibility: { ...profile.visibility, [key]: checked } });
  };
  return (
    <>
      <Button variant="subtle" size="xs" mt="md" onClick={open}>
        {copy.editProfile}
      </Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title={copy.editProfile} size="lg">
        <Stack>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
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
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label={copy.pronouns}
              value={profile.pronouns}
              onChange={(event) => update({ pronouns: event.currentTarget.value })}
            />
            <TextInput
              label={copy.addressingNote}
              value={profile.addressingNote}
              onChange={(event) => update({ addressingNote: event.currentTarget.value })}
            />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label={`${copy.birthday} — ${copy.month}`}
              type="number"
              min={1}
              max={12}
              value={profile.birthday?.month ?? ''}
              onChange={(event) =>
                update({
                  birthday: event.currentTarget.value
                    ? {
                        month: Number(event.currentTarget.value),
                        day: profile.birthday?.day ?? 1,
                      }
                    : null,
                })
              }
            />
            <TextInput
              label={`${copy.birthday} — ${copy.day}`}
              type="number"
              min={1}
              max={31}
              disabled={!profile.birthday}
              value={profile.birthday?.day ?? ''}
              onChange={(event) =>
                update({
                  birthday:
                    event.currentTarget.value && profile.birthday
                      ? { ...profile.birthday, day: Number(event.currentTarget.value) }
                      : null,
                })
              }
            />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label={copy.alternateEmail}
              type="email"
              value={profile.alternateEmail}
              onChange={(event) => update({ alternateEmail: event.currentTarget.value })}
            />
            <TextInput
              label={copy.phone}
              value={formatPhone(profile.phone)}
              onChange={(event) => update({ phone: event.currentTarget.value })}
            />
          </SimpleGrid>
          <MultiSelect
            label={copy.communicationPreferences}
            data={optionData(CONTACT_CHANNEL_OPTIONS, locale)}
            value={profile.communicationChannels}
            onChange={(values) => update({ communicationChannels: values as ContactChannel[] })}
          />
          <Select
            label={copy.preferredContact}
            disabled={profile.communicationChannels.length === 0}
            data={optionData(CONTACT_CHANNEL_OPTIONS, locale).filter((option) =>
              profile.communicationChannels.includes(option.value)
            )}
            value={
              profile.preferredContactMethod === 'none' ? null : profile.preferredContactMethod
            }
            onChange={(value) =>
              update({ preferredContactMethod: (value ?? 'none') as PreferredContactMethod })
            }
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label={copy.addressLine1}
              value={profile.address.line1}
              onChange={(event) =>
                update({ address: { ...profile.address, line1: event.currentTarget.value } })
              }
            />
            <TextInput
              label={copy.addressLine2}
              value={profile.address.line2}
              onChange={(event) =>
                update({ address: { ...profile.address, line2: event.currentTarget.value } })
              }
            />
            <TextInput
              label={copy.city}
              value={profile.address.city}
              onChange={(event) =>
                update({ address: { ...profile.address, city: event.currentTarget.value } })
              }
            />
            <TextInput
              label={copy.region}
              value={profile.address.region}
              onChange={(event) =>
                update({ address: { ...profile.address, region: event.currentTarget.value } })
              }
            />
            <TextInput
              label={copy.postalCode}
              value={profile.address.postalCode}
              onChange={(event) =>
                update({ address: { ...profile.address, postalCode: event.currentTarget.value } })
              }
            />
            <TextInput
              label={copy.country}
              value={profile.address.country}
              onChange={(event) =>
                update({ address: { ...profile.address, country: event.currentTarget.value } })
              }
            />
          </SimpleGrid>
          <Textarea
            label={copy.household}
            value={profile.household}
            onChange={(event) => update({ household: event.currentTarget.value })}
          />
          <MultiSelect
            label={copy.interests}
            data={optionData(MINISTRY_INTEREST_OPTIONS, locale)}
            value={profile.ministryInterests}
            onChange={(values) => update({ ministryInterests: values as MinistryInterestId[] })}
          />
          {profile.ministryInterests.includes('other') ? (
            <TextInput
              label={copy.otherInterest}
              value={profile.otherMinistryInterest}
              onChange={(event) => update({ otherMinistryInterest: event.currentTarget.value })}
            />
          ) : null}
          <Switch
            label={copy.directoryListed}
            checked={profile.visibility.listed}
            onChange={(event) => visibility('listed', event.currentTarget.checked)}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {(
              [
                ['preferredName', copy.showPreferredName],
                ['email', copy.showEmail],
                ['phone', copy.showPhone],
                ['pronouns', copy.showPronouns],
                ['address', copy.showAddress],
                ['birthday', copy.showBirthday],
                ['household', copy.showHousehold],
                ['relationships', copy.showRelationships],
                ['anniversary', copy.showAnniversary],
                ['ministryInterests', copy.showInterests],
                ['photo', copy.showPhoto],
                ['churchStatus', copy.showChurchStatus],
                ['churchRoles', copy.showChurchRoles],
              ] as Array<[keyof DirectoryProfile['visibility'], string]>
            ).map(([key, label]) => (
              <Checkbox
                key={key}
                label={label}
                checked={profile.visibility[key]}
                onChange={(event) => visibility(key, event.currentTarget.checked)}
              />
            ))}
          </SimpleGrid>
          <Button
            loading={busy}
            onClick={() =>
              run(async () => {
                await saveMemberProfile(actor, profile);
                setOpened(false);
                await reload();
              })
            }
          >
            {copy.save}
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

function AdminChurchRecordEditor({
  copy,
  actor,
  initialMetadata,
  busy,
  run,
  reload,
}: {
  copy: typeof copyByLocale.en;
  actor: MemberAccess;
  initialMetadata: ChurchMetadata;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
  reload: () => Promise<void>;
}) {
  const locale = useLocale();
  const [opened, setOpened] = useState(false);
  const [metadata, setMetadata] = useState(initialMetadata);
  return (
    <>
      <Button
        variant="subtle"
        size="xs"
        onClick={() => {
          setMetadata(initialMetadata);
          setOpened(true);
        }}
      >
        {copy.editChurchRecord}
      </Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title={copy.editChurchRecord}>
        <Stack>
          <Select
            label={copy.churchStatus}
            clearable
            data={optionData(CHURCH_STATUS_OPTIONS, locale)}
            value={metadata.churchStatus}
            onChange={(value) =>
              setMetadata({ ...metadata, churchStatus: value as ChurchStatus | null })
            }
          />
          <MultiSelect
            label={copy.churchRoles}
            data={optionData(CHURCH_ROLE_OPTIONS, locale)}
            value={metadata.churchRoles}
            onChange={(values) => setMetadata({ ...metadata, churchRoles: values as ChurchRole[] })}
          />
          <TextInput
            label={copy.dateJoined}
            type="date"
            value={metadata.dateJoined}
            onChange={(event) =>
              setMetadata({ ...metadata, dateJoined: event.currentTarget.value })
            }
          />
          <Button
            loading={busy}
            onClick={() =>
              run(async () => {
                await saveChurchMetadata(actor, metadata);
                setOpened(false);
                await reload();
              })
            }
          >
            {copy.save}
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

function AdminNotesEditor({
  copy,
  actor,
  uid,
  busy,
  run,
}: {
  copy: typeof copyByLocale.en;
  actor: MemberAccess;
  uid: string;
  busy: boolean;
  run: (work: () => Promise<void>, success?: string) => Promise<void>;
}) {
  const [opened, setOpened] = useState(false);
  const [notes, setNotes] = useState<MemberAdminNotes | null>(null);
  const open = async () => {
    setNotes(await loadMemberAdminNotes(uid, true));
    setOpened(true);
  };
  const save = (markReviewed: boolean) => {
    if (!notes) {
      return;
    }
    run(async () => {
      await saveMemberAdminNotes(actor, notes, markReviewed);
      setOpened(false);
    });
  };
  return (
    <>
      <Button variant="subtle" size="xs" onClick={open}>
        {copy.editInternalNotes}
      </Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title={copy.editInternalNotes}>
        {notes ? (
          <Stack>
            <Textarea
              label={copy.membershipNotes}
              minRows={4}
              autosize
              value={notes.membershipNotes}
              onChange={(event) =>
                setNotes({ ...notes, membershipNotes: event.currentTarget.value })
              }
            />
            <Textarea
              label={copy.internalNotes}
              minRows={6}
              autosize
              value={notes.internalNotes}
              onChange={(event) => setNotes({ ...notes, internalNotes: event.currentTarget.value })}
            />
            {notes.lastReviewedAt ? (
              <Text size="sm" c="dimmed">
                {copy.lastReviewed}: {notes.lastReviewedAt.toLocaleString()} ·{' '}
                {notes.lastReviewedByName}
              </Text>
            ) : null}
            <Group justify="flex-end">
              <Button variant="light" loading={busy} onClick={() => save(false)}>
                {copy.save}
              </Button>
              <Button loading={busy} onClick={() => save(true)}>
                {copy.markReviewed}
              </Button>
            </Group>
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
  const [consent, setConsent] = useState(false);
  return (
    <Group align="center" mt="lg">
      <Checkbox
        label={copy.consent}
        checked={consent}
        onChange={(event) => setConsent(event.currentTarget.checked)}
      />
      <AvatarCropper
        busy={busy}
        copy={copy}
        disabled={!consent}
        triggerLabel={copy.adminUpload}
        submitLabel={copy.adminConfirmPhoto}
        onError={(message) =>
          void run(async () => {
            throw new Error(message);
          })
        }
        onSubmit={async (source, position) => {
          let succeeded = false;
          await run(async () => {
            await uploadMemberAvatar(uid, await prepareAvatar(source, position));
            setConsent(false);
            succeeded = true;
          });
          return succeeded;
        }}
      />
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

function formatDateOnly(value: string, locale: 'en' | 'es') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return '';
  }
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-US' : 'en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
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
