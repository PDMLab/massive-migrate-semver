var async = require('async');

exports.up = function(db, options, callback) {
    async.parallel([
        function(cb) {
            db.altercustomertable(function(err, result){
                if(err) {
                    console.log('up error while updating customer table: ', err);
                    cb(err);
                } else {
                    if (options.seedTestData) {
                        db.updatecustomertestdata(function (err) {
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