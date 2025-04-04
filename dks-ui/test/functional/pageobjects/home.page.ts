import { $ } from '@wdio/globals'
import Page from './page.js';

class HomePage extends Page {
    public get inputContributor () {
        return $('input[name="firstName"][data-testid="inputfirstName"]');
    }

    public get inputBlogTitle () {
        return $('input[name="title"][data-testid="inputtitle"]');
    }

    public get inputBlogURL () {
        return $('input[name="link"][data-testid="inputlink"]');
    }

    public get submitButton () {
        return $('input[type="submit"]');
    }

    public get blogEntries () {
        return $$('tr[data-testid="blog-list-item"]')
    }

    async open () {
        return super.open('/');
    }
}

const homePage = new HomePage();
export default homePage;
