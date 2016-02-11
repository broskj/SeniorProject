/**
 * LightsCtrl.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        status: {
            type: "boolean",
            required: true
        },
        timed: {
            type: "boolean",
            required: true
        },
        onTime: {
            type: "date",
            required: false
        },
        offTime: {
            type: "date",
            required: false
        },
        onMotion: {
            type: "boolean",
            required: true
        },
        description: {
            type: "string",
            required: true
        }
    }
};
