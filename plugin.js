const plugin = require("tailwindcss/plugin");
const {trim} = require("lodash");

const dynamicClassesPlugin = plugin(
    function ({ addComponents, theme, e }) {
        const scopes = theme("dynamicClasses");
        const components = getComponents(scopes);
        if(components) {
            addComponents(components)
        }
    },
    {
        theme: {
            dynamicClasses: {
                //config tailwind.config.ts
            }
        }
    }
);

const getComponents = (scopes) => {
    const classes = generateDynamicCssClasses(scopes);

    const ret = {};
    classes.forEach((cls) => {
        ret[`.${cls}`] = {
            '--dynamic-class': cls
        };
    })

    return ret;
}

const generateDynamicCssClasses = (scopes) => {
    const ret = [];

    scopes.forEach( (scope) => {
        const classes = generateClasses(scope);
        if(classes.length) {
            classes.forEach( (cls) => {
                if(trim(cls) !== '') {
                    ret.push(cls);
                }
            });
        }
    });

    console.log(ret);
    return ret;
}

const generateClasses = (scope, pre) => {
    const ret = [];
    if (!pre) pre = '';

    if (typeof scope === 'object') {
        let key;
        for (key in scope) {
            const val = scope[key];

            let localPre = '';
            if (isNaN(+key)) { //object
                localPre = pre ? `${pre}-${key}` : `${key}`;
            } else { //array
                localPre = pre;
            }

            const classes = generateClasses(val, localPre);
            classes.forEach((cls) => {
                if (trim(cls) !== '') {
                    ret.push(cls);
                }
            });
        }
    } else {
        const val = scope;
        const localPre = !pre.startsWith('other') ? `${pre}-` : '';
        return [`${localPre}${val}`];
    }

    return ret;
}

module.exports = dynamicClasses;