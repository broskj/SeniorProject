/**
 * AlarmCtrlController
 *
 * @description :: Server-side logic for managing Alarmctrls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    restricted: function(req, res) {
        return res.ok("restricted");
    },
    open: function(req, res) {
        return res.ok("open");
    },
    jwt: function(req, res) {
        return res.ok("jwt")
    }

    /*
    toggle: function(req, res) {
        var sentParamsObj = req.allParams();
        var id = Number(sentParamsObj.id);
        var status = !sentParamsObj.status;

        AlarmCtrl.update(id, {status: status}).then(function(updatedObj) {
            return res.ok(updatedObj);
        }).catch(function(err) {
            return res.serverError(err);
        });
    },
    get: function(req, res) {
        //sails.log.verbose("AlarmCtrlController -> get called");
        AlarmCtrl.find().then(function(alarms) {
            if(alarms) {
                return res.send(alarms);
            } else {
                return res.badRequest();
            }
        })
    }*/
};
