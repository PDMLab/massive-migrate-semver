var async = require('async');

exports.up = function(db, callback) {
    async.parallel([
        function(cb) {
            db.altercustomertable(function(err, result){
                if(err) {
                    console.log('up error while updating customer table: ', err);
                    cb();
                }
                cb()
            });

        }
    ], function(err, result) {
        callback(err)
    })

};