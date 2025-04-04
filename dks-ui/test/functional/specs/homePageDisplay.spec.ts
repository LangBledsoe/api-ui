import { expect } from '@wdio/globals'
import HomePage from "../pageobjects/home.page.js";

describe('Home page', () => {
    it('should open', async () => {
        await HomePage.open()
        await expect(browser).toHaveTitle('DKS')
    })
    it('should contain a form for sharing a blog', async () => {
        await HomePage.open()
        await expect(HomePage.inputContributor).toBeDisplayed()
        await expect(HomePage.inputBlogTitle).toBeDisplayed()
        await expect(HomePage.inputBlogURL).toBeDisplayed()
        await expect(HomePage.submitButton).toBeDisplayed()
    })
})
