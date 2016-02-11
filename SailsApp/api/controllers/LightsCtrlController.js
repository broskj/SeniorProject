/**
 * LightsCtrlController
 *
 * @description :: Server-side logic for managing Lightsctrls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
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
