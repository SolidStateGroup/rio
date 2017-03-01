/**
 * Created by kylejohnson on 27/09/2016.
 * Retrieves additional parameters from the document
 */
module.exports = (params) => {
    if (typeof document == 'undefined') {
        return params;
    }
    let $params = document.getElementById('params');
    return Object.assign({}, params, $params ? JSON.parse($params.innerText) : {});
};