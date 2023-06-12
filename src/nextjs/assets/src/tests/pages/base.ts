import {BrowserContext, Locator, Page} from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async open(path: string) {
    return this.page.goto(path)
  }

  async handleNewTab(locator: Locator, context: BrowserContext) {
    const [newPage] = await Promise.all([context.waitForEvent('page'), locator.click()])
    return newPage
  }
}
