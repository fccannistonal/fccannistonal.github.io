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
        staff: 'Staff',
        community: 'Church Life',
        worshipAndMusic: 'Sunday Worship',
        wonderAndWorship: 'Children’s Ministry',
        hispanicMinistry: 'Hispanic Ministry',
        serviceAndOutreach: 'Service and Outreach',
        diversityTheater: 'Diversity Theater',
        updates: 'Updates',
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
        'We use optional analytics to understand which pages help visitors. Maps, Spotify, and Facebook remain blocked until you choose to load them.',
      accept: 'Allow analytics',
      decline: 'Necessary only',
      privacyLink: 'Read the privacy notice',
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
        staff: 'Personal',
        community: 'Vida de la iglesia',
        worshipAndMusic: 'Adoración dominical',
        wonderAndWorship: 'Ministerio infantil',
        hispanicMinistry: 'Ministerio hispano',
        serviceAndOutreach: 'Servicio comunitario',
        diversityTheater: 'Teatro Diversidad',
        updates: 'Novedades',
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
        'Usamos analítica opcional para saber qué páginas ayudan a los visitantes. Los mapas, Spotify y Facebook permanecen bloqueados hasta que usted decida cargarlos.',
      accept: 'Permitir analítica',
      decline: 'Solo lo necesario',
      privacyLink: 'Leer el aviso de privacidad',
    },
    sermonsLabel: 'Sermones y reflexiones',
  },
};

export function getShellContent(locale: Locale) {
  return localizedShellContent[locale];
}
