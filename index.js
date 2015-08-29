var semver = require('semver');
var Migration = require('massive-migrate');
var fs = require('fs');
var serialization = require('typewise-semver');
var stringify = serialization.stringify;
var bytewise = require('bytewise-core');
var async = require('async');


function orderMigrations(results) {
    var migrations = {};

    for (var i = 0; i < results.length; i++) {
        var splitted = results[i].split('.');
        for (var j = 0; j < splitted.length; j++) {
            splitted[j] = parseInt(splitted[j])
        }
        migrations[results[i]] = splitted
    }

    var unorderedmigrations = Object.keys(migrations).slice();

    var sorted = [];

    unorderedmigrations.map(function (key) {
        return migrations[key]
    })
        .map(bytewise.encode)
        .sort(bytewise.compare)
        .map(bytewise.decode)
        .forEach(function (v, j) {
            sorted.push(stringify(v));
            var x = stringify(v);
        });
    return sorted;
}

function getAvailableMigrations(migrationsDirectory, callback) {
    fs.readdir(migrationsDirectory, function (err, results) {
        callback(orderMigrations(results));
    });
}

function applyMigration(db, options, callback) {
    getAvailableMigrations(options.migrationsDirectory, function(sorted) {
        db.pgmigration.findOne({version: options.version}, function (err, exitstingMigration) {
            if (!err) {
                if (typeof exitstingMigration === typeof undefined) {


                    // last migration?
                    if (sorted.indexOf(options.version) === sorted.length - 1) {

                        db.pgmigration.find({}, function (err, appliedMigrations) {
                            if (!err) {
                                if(appliedMigrations.length === 0) {

                                    async.eachSeries(sorted, function(version, cb) {
                                        var migration = new Migration(
                                            options.connectionString,
                                            options.migrationsDirectory,
                                            version, function () {
                                                migration.up(version + '-up', cb);
                                            });
                                    }, function(err) {
                                        if(!err) {
                                            callback();
                                        }
                                    });


                                }


                            }
                        });


                    }

                } else {
                    console.log('Migration ' + options.version + ' already applied')
                    callback()
                }
            }
        })
    });

}

module.exports = {up: up};

function up(options, callback) {

    if (semver.valid(options.version)) {
        var massive = require('massive');
        massive.connect({
            connectionString: options.connectionString, scripts: __dirname + '/db'
        }, function (err, db) {
            if (!err) {
                var migrationTableExist = false;
                for (var i = 0; i < db.tables.length; i++) {
                    if (db.tables[i].name === 'pgmigration') {
                        migrationTableExist = true;
                    }
                }

                if(!migrationTableExist) {
                    var migration = new Migration(
                            options.connectionString,
                            options.migrationsDirectory,
                            options.version, function () {
                                massive.connect(db, function(err, db) {
                                    applyMigration(db, options, callback);
                                })
                            });

                }
                else {

                }
            }
            else {
                if (err) throw err;
                console.log('error: ', err)

            }
        });

    }
};
