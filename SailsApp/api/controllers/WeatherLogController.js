/**
 * WeatherLogController
 *
 * @description :: Server-side logic for managing weatherlogs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    attributes: {
        //id automatically created and incremented
        temp: {
            type: "float",
            required: "true"
        },
        hum: {
            type: "float",
            required: "true"
        }
        //time is handled by default through createdAt() and updatedAt()
    }
};