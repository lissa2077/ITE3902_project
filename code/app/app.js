import Vue from 'nativescript-vue';

import Main from './components/Main';

// Uncommment the following to see NativeScript-Vue output logs
// Vue.config.silent = false;

new Vue({

    template: `
        <Frame>
            <Main />
        </Frame>`,

    components: {
        Main
    }
}).$start();