import { render, screen } from '@/test-utils';
import { outreachItems } from '../content/churchContent';
import { OutreachPage } from './Outreach.page';

describe('OutreachPage', () => {
  it('renders outreach stories from the content model', () => {
    render(<OutreachPage />);

    expect(screen.getByText(outreachItems[0].title)).toBeInTheDocument();
    expect(screen.getByText(outreachItems[1].title)).toBeInTheDocument();
    expect(screen.getByText(outreachItems[0].highlights[0])).toBeInTheDocument();
  });
});
