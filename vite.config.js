import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import rtlcss from 'rtlcss';

function rtlcssSpecificFile() {
    return {
        name: 'RtlcssSpecificFile',

        transform(src, id) {
            // #TODO Can be handle better
            if (id.endsWith('/assets/scss/app-rtl.scss')) {
                return {
                    code: rtlcss.process(src)
                };
            }
        }
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), rtlcssSpecificFile()],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
