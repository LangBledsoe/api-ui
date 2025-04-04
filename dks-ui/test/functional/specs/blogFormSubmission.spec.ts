import { expect } from '@wdio/globals'
import HomePage from "../pageobjects/home.page.js";
import blogListSingleEntryFixture from '../fixtures/blogListSingleEntry.json' assert { type: "json" };

describe('Home page', () => {
    it('should submit new blog and update blog list', async () => {
        const getMock= await browser.mock( '**/posts', {
            method: 'get'
        })
        getMock.respond(blogListSingleEntryFixture,{
            statusCode: 200,
            headers: { 'content-type': 'application/json' },
            fetchResponse: false
        })

        // Set up mock to intercept POST request
        const postMock= await browser.mock('**/api/posts', {
            method: 'post'
        })

        // Set fetchResponse to false so the request is not sent (to avoid server-side error)
        postMock.respond( {},{
            fetchResponse: false
        })

        await HomePage.open();

        await Promise.all([
            HomePage.inputContributor.setValue('Test User'),
            HomePage.inputBlogTitle.setValue('Example Blog'),
            HomePage.inputBlogURL.setValue('https://example.com/blog')
        ])
        await HomePage.submitButton.click();

        // Wait for the blog entry to be added to the table
        await browser.waitUntil(async () => {
            return (await HomePage.blogEntries).length > 0;
        }, {
            interval: 100,
            timeout: 3000,
            timeoutMsg: 'Expected blog entry to be added to table within 3s'
        })

        // Verify that the POST request was sent
        await expect(postMock.calls.length).toBe(1);

        // Verify that the POST request was sent
        await expect(await HomePage.blogEntries).toHaveLength(1);
        await expect(await HomePage.blogEntries[0]).toHaveText(expect.stringContaining('Test User'));
        await expect(await HomePage.blogEntries[0]).toHaveText(expect.stringContaining('Example Blog'));
        await expect(await HomePage.blogEntries[0]).toHaveText(expect.stringContaining('example.com'));
    });
});
