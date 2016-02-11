/**
* WeatherLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
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
