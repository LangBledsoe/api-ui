import { expect } from '@wdio/globals'
import AboutPage from "../pageobjects/about.page.js";

describe('About page', () => {
    it('should open', async () => {
        await AboutPage.open()
        await expect(AboutPage.aboutTitle).toHaveText('About Page')
    })
})
