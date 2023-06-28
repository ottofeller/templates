import {Page} from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async open(path: string) {
    return this.page.goto(path)
  }
}
