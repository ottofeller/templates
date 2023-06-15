import {qase} from 'playwright-qase-reporter/dist/playwright'
import {test, Users} from '../common'
import {errors} from '../data'

describe('Authorization & Authentication', () => {
  const password = 'secret_sauce'

  test.beforeAll(async ({signInPage}) => {
    await signInPage.open()
  })

  test(qase('', 'Sign in with valid credentials'), async ({signInPage, productsPage}) => {
    await signInPage.input.username.fill(Users.standard)
    await signInPage.input.password.fill(password)
    await signInPage.button.login.click()
    await expect(productsPage.productList).toBeVisible()
    await expect(productsPage.item).toBeVisible()
  })

  test(qase('', 'Sign in with locked user credentials'), async ({signInPage}) => {
    await signInPage.input.username.fill(Users.locked)
    await signInPage.input.password.fill(password)
    await signInPage.button.login.click()
    await expect(signInPage.error).toBeVisible()
    await expect(signInPage.error).toHaveText(errors.signIn.lockedUser)
  })
})
