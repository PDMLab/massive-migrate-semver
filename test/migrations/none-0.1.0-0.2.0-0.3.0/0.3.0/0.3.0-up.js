var async = require('async');

exports.up = function(db, callback) {
    async.parallel([
        function(cb) {
            db.createsuppliertable(function(err, result){
                if(err) {
                    console.log('up error while creating supplier table: ', err);
                    cb();
                }
                cb()
            });

        }
    ], function(err, result) {
        callback(err)
    })

};