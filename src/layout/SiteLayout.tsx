import type { ReactNode } from 'react';
import { FooterSimple } from '../components/FooterSimple/FooterSimple';
import { HeaderSimple } from '../components/HeaderSimple/HeaderSimple';
import classes from './SiteLayout.module.css';

type Props = {
  children: ReactNode;
};

export function SiteLayout({ children }: Props) {
  return (
    <div className={classes.shell}>
      <HeaderSimple />
      <main className={classes.main}>
        <div className={classes.content}>{children}</div>
      </main>
      <footer>
        <FooterSimple />
      </footer>
    </div>
  );
}
