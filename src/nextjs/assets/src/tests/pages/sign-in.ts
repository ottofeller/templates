import {Locator, Page} from '@playwright/test'
import {BasePage} from './base'

export class SignInPage extends BasePage {
  readonly link: {
    worldcoinFoundation: Locator
    toolsForHumanity: Locator
  }

  constructor(page: Page) {
    super(page)

    this.link = {
      worldcoinFoundation: this.page.locator('a[href="https://www.worldcoin.foundation/"]', {
        hasText: 'Worldcoin Foundation',
      }),
      toolsForHumanity: this.page.locator('a[href="https://www.toolsforhumanity.com/"]', {
        hasText: 'Tools for Humanity',
      }),
    }
  }

  async open() {
    return super.open('/')
  }
}
