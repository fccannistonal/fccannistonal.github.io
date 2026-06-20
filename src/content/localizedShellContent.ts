import type { Locale, RouteId } from '../lib/routing';
import type { ServiceId } from './churchContent';

type ShellContent = {
  common: {
    denomination: string;
    churchName: string;
    shortName: string;
    skipToContent: string;
    navigationLabel: string;
    openNavigation: string;
    closeNavigation: string;
    loadingPage: string;
    navigation: Record<RouteId, string>;
    churchLifeMenu: {
      openLabel: string;
      hubLabel: string;
      hubDescription: string;
      subpagesLabel: string;
    };
    languageName: string;
    switchLanguage: string;
    give: string;
    opensNewTab: string;
    serviceLabels: Record<ServiceId, string>;
    footerSummary: string;
    footerExplore: string;
    footerOnline: string;
    footerConnect: string;
    social: {
      facebookTitle: string;
      facebookCta: string;
      linktreeTitle: string;
      linktreeCta: string;
    };
    serviceAlert: {
      enabled: boolean;
      title: string;
      message: string;
    };
  };
  consent: {
    title: string;
    description: string;
    accept: string;
    decline: string;
    privacyLink: string;
  };
  routeError: {
    label: string;
    staleTitle: string;
    staleDescription: string;
    genericTitle: string;
    genericDescription: string;
    refreshAction: string;
    homeAction: string;
    contactAction: string;
    helpTitle: string;
    staleHelp: string;
    genericHelp: string;
    developerDetails: string;
  };
  sermonsLabel: string;
};

export const localizedShellContent: Record<Locale, ShellContent> = {
  en: {
    common: {
      denomination: 'Disciples of Christ',
      churchName: 'First Christian Church Anniston',
      shortName: 'FCC Anniston',
      skipToContent: 'Skip to main content',
      navigationLabel: 'Main navigation',
      openNavigation: 'Open navigation',
      closeNavigation: 'Close navigation',
      loadingPage: 'Loading page',
      navigation: {
        home: 'Home',
        visit: 'Visit',
        about: 'About',
        membership: 'Membership and Baptism',
        recommendedReading: 'Recommended Reading',
        staff: 'Staff',
        community: 'Church Life',
        worshipAndMusic: 'Sunday Worship',
        wonderAndWorship: 'Children’s Ministry',
        hispanicMinistry: 'Hispanic Ministry',
        serviceAndOutreach: 'Service and Outreach',
        diversityTheater: 'Diversity Theater',
        updates: 'Updates',
        members: 'Members',
        memberProfile: 'Profile',
        memberDirectory: 'Member Directory',
        memberGroups: 'Groups',
        memberCalendar: 'Calendar',
        memberUpdates: 'Member Updates',
        memberAdmin: 'Portal Admin',
        memberGivingStatements: 'Giving Statements',
        contact: 'Contact',
        privacy: 'Privacy',
      },
      churchLifeMenu: {
        openLabel: 'Open Church Life menu',
        hubLabel: 'Church Life home',
        hubDescription: 'Start with the full overview of worship, care, service, and belonging.',
        subpagesLabel: 'Go directly to',
      },
      languageName: 'Español',
      switchLanguage: 'Ver el sitio en español',
      give: 'Give Online',
      opensNewTab: 'opens in a new tab',
      serviceLabels: {
        sundaySchool: 'Sunday School',
        worship: 'Worship Service',
      },
      footerSummary:
        'An open and affirming Disciples of Christ congregation serving Anniston through worship, welcome, and community life.',
      footerExplore: 'Explore',
      footerOnline: 'Online',
      footerConnect: 'Connect',
      social: {
        facebookTitle: 'Facebook',
        facebookCta: 'Follow on Facebook',
        linktreeTitle: 'FCC Anniston Links',
        linktreeCta: 'Explore our Linktree',
      },
      serviceAlert: {
        enabled: false,
        title: 'Schedule update',
        message: 'Sunday services are following the regular schedule.',
      },
    },
    consent: {
      title: 'Your privacy choices',
      description:
        'We use Google Analytics consent mode to understand which pages help visitors. Analytics cookies stay off unless you allow them.',
      accept: 'Allow analytics',
      decline: 'Keep analytics cookies off',
      privacyLink: 'Read the privacy notice',
    },
    routeError: {
      label: 'Page trouble',
      staleTitle: 'This page needs a quick refresh',
      staleDescription:
        'The site was updated while your browser still had an older page open. Refreshing will load the newest version and usually fixes this right away.',
      genericTitle: 'We could not load this page',
      genericDescription:
        'Something went wrong while opening this part of the site. You can refresh, return home, or contact the church office if it keeps happening.',
      refreshAction: 'Refresh page',
      homeAction: 'Go home',
      contactAction: 'Email the church',
      helpTitle: 'What happened?',
      staleHelp:
        'This can happen after a new site release because page files use versioned names. Your browser asked for an older file that is no longer available.',
      genericHelp:
        'The rest of the site may still work. If this page keeps failing after a refresh, please let us know which page you were trying to visit.',
      developerDetails: 'Developer details',
    },
    sermonsLabel: 'Sermons and reflections',
  },
  es: {
    common: {
      denomination: 'Discípulos de Cristo',
      churchName: 'Primera Iglesia Cristiana de Anniston',
      shortName: 'FCC Anniston',
      skipToContent: 'Saltar al contenido principal',
      navigationLabel: 'Navegación principal',
      openNavigation: 'Abrir navegación',
      closeNavigation: 'Cerrar navegación',
      loadingPage: 'Cargando página',
      navigation: {
        home: 'Inicio',
        visit: 'Visita',
        about: 'Acerca',
        membership: 'Membresía y bautismo',
        recommendedReading: 'Lecturas recomendadas',
        staff: 'Personal',
        community: 'Vida de la iglesia',
        worshipAndMusic: 'Adoración dominical',
        wonderAndWorship: 'Ministerio infantil',
        hispanicMinistry: 'Ministerio hispano',
        serviceAndOutreach: 'Servicio comunitario',
        diversityTheater: 'Teatro Diversidad',
        updates: 'Novedades',
        members: 'Miembros',
        memberProfile: 'Perfil',
        memberDirectory: 'Directorio de miembros',
        memberGroups: 'Grupos',
        memberCalendar: 'Calendario',
        memberUpdates: 'Novedades de miembros',
        memberAdmin: 'Administración del portal',
        memberGivingStatements: 'Comprobantes de donaciones',
        contact: 'Contacto',
        privacy: 'Privacidad',
      },
      churchLifeMenu: {
        openLabel: 'Abrir menú de vida de la iglesia',
        hubLabel: 'Página principal de vida de la iglesia',
        hubDescription:
          'Comience con la vista general de adoración, cuidado, servicio y pertenencia.',
        subpagesLabel: 'Ir directamente a',
      },
      languageName: 'English',
      switchLanguage: 'View the site in English',
      give: 'Donar en línea',
      opensNewTab: 'se abre en una pestaña nueva',
      serviceLabels: {
        sundaySchool: 'Escuela dominical',
        worship: 'Servicio de adoración',
      },
      footerSummary:
        'Una congregación abierta y afirmativa de los Discípulos de Cristo que sirve a Anniston mediante la adoración, la bienvenida y la vida comunitaria.',
      footerExplore: 'Explorar',
      footerOnline: 'En línea',
      footerConnect: 'Conectar',
      social: {
        facebookTitle: 'Facebook',
        facebookCta: 'Seguir en Facebook',
        linktreeTitle: 'Enlaces de FCC Anniston',
        linktreeCta: 'Explorar Linktree',
      },
      serviceAlert: {
        enabled: false,
        title: 'Actualización del horario',
        message: 'Los servicios dominicales siguen el horario habitual.',
      },
    },
    consent: {
      title: 'Sus opciones de privacidad',
      description:
        'Usamos el modo de consentimiento de Google Analytics para saber qué páginas ayudan a los visitantes. Las cookies de analítica permanecen desactivadas hasta que usted las permita.',
      accept: 'Permitir analítica',
      decline: 'No usar cookies analíticas',
      privacyLink: 'Leer el aviso de privacidad',
    },
    routeError: {
      label: 'Problema de página',
      staleTitle: 'Esta página necesita actualizarse',
      staleDescription:
        'El sitio se actualizó mientras su navegador todavía tenía abierta una versión anterior. Al actualizar, se cargará la versión más reciente y normalmente se resuelve de inmediato.',
      genericTitle: 'No pudimos cargar esta página',
      genericDescription:
        'Algo salió mal al abrir esta parte del sitio. Puede actualizar, volver al inicio o escribir a la oficina de la iglesia si sigue ocurriendo.',
      refreshAction: 'Actualizar página',
      homeAction: 'Ir al inicio',
      contactAction: 'Enviar correo',
      helpTitle: '¿Qué pasó?',
      staleHelp:
        'Esto puede ocurrir después de una nueva publicación del sitio porque los archivos de página usan nombres con versión. Su navegador pidió un archivo anterior que ya no está disponible.',
      genericHelp:
        'Es posible que el resto del sitio todavía funcione. Si esta página sigue fallando después de actualizar, díganos qué página intentaba visitar.',
      developerDetails: 'Detalles para desarrollo',
    },
    sermonsLabel: 'Sermones y reflexiones',
  },
};

export function getShellContent(locale: Locale) {
  return localizedShellContent[locale];
}
