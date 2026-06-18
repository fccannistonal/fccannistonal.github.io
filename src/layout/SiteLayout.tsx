import type { ReactNode } from 'react';
import { AnalyticsRouteTracker } from '../components/church/AnalyticsRouteTracker';
import { DeferredConsentBanner } from '../components/church/DeferredConsentBanner';
import { FooterSimple } from '../components/FooterSimple/FooterSimple';
import { HeaderSimple } from '../components/HeaderSimple/HeaderSimple';
import { getShellContent } from '../content/localizedShellContent';
import { useLocale } from '../lib/i18n';
import classes from './SiteLayout.module.css';

type Props = {
  children: ReactNode;
};

export function SiteLayout({ children }: Props) {
  const locale = useLocale();
  const content = getShellContent(locale);

  return (
    <div className={classes.shell}>
      <a className={classes.skipLink} href="#main-content">
        {content.common.skipToContent}
      </a>
      <HeaderSimple />
      <AnalyticsRouteTracker />
      {content.common.serviceAlert.enabled && (
        <div className={classes.alertContainer}>
          <div className={classes.serviceAlert} role="status">
            <strong>{content.common.serviceAlert.title}</strong>
            <span>{content.common.serviceAlert.message}</span>
          </div>
        </div>
      )}
      <main id="main-content" className={classes.main}>
        <div className={classes.content}>{children}</div>
      </main>
      <footer>
        <FooterSimple />
      </footer>
      <DeferredConsentBanner />
    </div>
  );
}
