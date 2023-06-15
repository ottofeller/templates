import {Locator, Page} from '@playwright/test'
import {BasePage} from './base'

export class ProductsPage extends BasePage {
  readonly productList: Locator
  readonly item: Locator

  constructor(page: Page) {
    super(page)

    this.productList = this.page.locator('.inventory_list')
    this.item = this.page.locator('.inventory_item')
  }

  async getItem(name: string) {
    return this.page.locator('.inventory_item', {hasText: name})
  }
}
