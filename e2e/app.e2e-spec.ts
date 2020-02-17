import { TimeTrackerPage } from './app.po';

describe('core-ui App', function() {
  let page: TimeTrackerPage;

  beforeEach(() => {
    page = new TimeTrackerPage();
  });

  it('should display footer containing creativeLabs', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toContain('creativeLabs');
  });
});
