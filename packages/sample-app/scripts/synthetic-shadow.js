const SYNTHETIC_IMPORT = 'import "@lwc/synthetic-shadow";';

module.exports = function() {
    let input;
    return {
        name: 'synthetic-shadow',
        options(rollupOpts) {
            input = rollupOpts.input;
        },
        transform(src, id) {
            if (id === input) {
                src = SYNTHETIC_IMPORT + src;
            }

            return { code: src, map: null };
        },
    };
};
