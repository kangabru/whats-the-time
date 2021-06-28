/*
* A tailwinds config file used to generate atomic utility css classes.
* See: https://tailwindcss.com/docs/configuration/
* Def: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/

const colors = require('tailwindcss/colors')
const withDefaultColour = (colours) => ({ ...colours, DEFAULT: colours[500] })

module.exports = {
    darkMode: 'class',
    purge: [
        "./src/**/*.html",
        "./src/**/*.js",
        "./src/**/*.jsx",
        "./src/**/*.ts",
        "./src/**/*.tsx",
    ],
    theme: {
        extend: {
            colors: {
                green: withDefaultColour(colors.green),
                gray: withDefaultColour(colors.gray),
                red: withDefaultColour(colors.red),
                yellow: withDefaultColour(colors.yellow),
                orange: withDefaultColour(colors.orange),
                blue: withDefaultColour(colors.blue),
                indigo: withDefaultColour(colors.indigo),
                purple: withDefaultColour(colors.purple),
                pink: withDefaultColour(colors.pink),
            },
        },
    },
    variants: {
        extend: {
            display: ['group-hover', 'group-focus'],
            backgroundColor: ['group-hover', 'focus'],
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
