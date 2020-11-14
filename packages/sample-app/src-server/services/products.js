const { data } = require('./data');

function getCategories() {
    const categories = new Set();
    for(let i=0; i<data.length; i++) {
        const p =  data[i];
        categories.add(p['ProductCategory']);
    }
    return Array.from(categories);
}

function getProductsByCategory(category) {
    const result = [];
    for(let i=0; i<data.length; i++) {
        const p =  data[i];
        if(category && p['ProductCategory'].startsWith(category)) {
            result.push({...p});
        }
    }
    return result;
}

module.exports = {
    getCategories,
    getProductsByCategory
}
