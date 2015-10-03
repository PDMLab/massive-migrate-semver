var async = require('async');

exports.up = function(db, options, callback) {
    async.parallel([
        function(cb) {
            db.createsalutationtable(function(err, result){
                if(err) {
                    console.log('up error while creating salutation table: ', err)
                }
                cb(err)
            });

        },
        function(cb) {
            db.createcustomertable(function(err, result) {
                if(err) {
                    console.log('up error while creating customer table: ', err);
                    cb(err);
                } else {
                    if (options.seedTestData) {
                        db.seedcustomertestdata(function (err) {
                            cb(err)
                        })
                    } else {
                        cb();
                    }
                }
            })
        }
    ], function(err, result) {
        callback(err)
    })

};