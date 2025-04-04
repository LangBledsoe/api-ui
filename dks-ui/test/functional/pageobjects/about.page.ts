import { $ } from '@wdio/globals'
import Page from './page.js';

class AboutPage extends Page {
    public get aboutTitle () {
        return $('h1');
    }

    async open () {
        return super.open('/about');
    }
}

const aboutPage = new AboutPage();
export default aboutPage;
