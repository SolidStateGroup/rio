/*
* Allows for any data to be injected into the pages from the server
* Only do things here when absolutely required as this blocks the initial page render
* */

import data from '../common/data/example_api';
module.exports = (route, params) => new Promise((resolve, reject)=> {
    const { name } = route;
    switch (name) {
        case 'clientServer' : {
            console.log(route)
            return data.getCollection(params.id)
                .then((collection)=>{
                    resolve({collection});
                });
        }
        default:
            return resolve({});
    }
});