/**
 * WeatherCtrlController
 *
 * @description :: Server-side logic for managing Weatherctrls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    attributes: {
        duration: {
            type: "int",
            required: true
        },
        fetch: {
            type: "boolean",
            required: true
        }
    }
};