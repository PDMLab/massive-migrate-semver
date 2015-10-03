var async = require('async');

exports.up = function(db, options, callback) {
    async.parallel([
        function(cb) {
            db.createsuppliertable(function(err, result){
                if(err) {
                    console.log('up error while creating supplier table: ', err);
                    cb();
                } else {
                    if (options.seedTestData) {
                        db.seedsuppliertestdata(function (err) {
                            cb(err)
                        })
                    } else {
                        cb();
                    }
                }
            });

        }
    ], function(err, result) {
        callback(err)
    })

};