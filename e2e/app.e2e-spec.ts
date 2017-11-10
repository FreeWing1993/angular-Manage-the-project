import { ActionPage } from './app.po';

describe('action App', () => {
  let page: ActionPage;

  beforeEach(() => {
    page = new ActionPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
