var semver = require('semver');
var massiveMigrate = require('massive-migrate');
var fs = require('fs');
var serialization = require('typewise-semver');
var stringify = serialization.stringify;
var bytewise = require('bytewise-core');
var async = require('async');
var _ = require('underscore');


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

function applyMigration(db, migrations, options, callback) {

        getAvailableMigrations(options.migrationsDirectory, function(sorted) {
            migrations.hasUpMigration(options.version, function (err, hasMigration) {
                if (!err) {
                    if (!hasMigration) {

                        // last migration?
                        if (sorted.indexOf(options.version) === sorted.length - 1) {
                            db.pgmigration.find({}, function (err, appliedMigrations) {
                                if (!err) {
                                    if(appliedMigrations.length === 0) {

                                        async.eachSeries(sorted, function(version, cb) {
                                                    migrations.runUpMigration({ name: version }, cb);

                                        }, function(err) {
                                            if(!err) {
                                                callback();
                                            }
                                        });
                                    } else {
                                        async.eachSeries(sorted, function(version, cb) {
                                            if(semver.lt(version, options.version) && _.any(appliedMigrations, function(m) {
                                                    return m.name === version
                                                })) {
                                                // version below and already migrated
                                                cb()
                                            } else if (semver.lt(version, options.version) && (!_.any(appliedMigrations, function(m) { return m.name === version}))) {
                                                // version below but not applied: '
                                                migrations.runUpMigration({ name : version }, cb);
                                            } else if (semver.gt(version, options.version)) {
                                                // version greater must not apply
                                                cb();
                                            } else {
                                                migrations.runUpMigration({ name: options.version }, cb);
                                            }

                                        }, function(err) {
                                            if(!err) {
                                                callback();
                                            }
                                        });
                                    }
                                } else {
                                    console.log('error finding applied: ', err)
                                }
                            });
                        } else {
                            db.pgmigration.find({}, function (err, appliedMigrations) {
                                if (!err) {
                                    if (appliedMigrations.length === 0) {

                                        async.eachSeries(sorted, function(version, cb) {
                                            if (semver.lt(version, options.version)) {
                                                // version below but not applied: '
                                                migrations.runUpMigration({ name: version }, cb);
                                            } else if (semver.gt(version, options.version)) {
                                                // version greater must not apply
                                                cb();
                                            } else {
                                                migrations.runUpMigration({ name : options.version }, cb);
                                            }

                                        }, function(err) {
                                            if(!err) {
                                                callback();
                                            }
                                        });
                                    } else {

                                        // not the last, but there are existing ones
                                        // might be: 0.1.0 already applied, want to apply 0.2.0 and 0.3.0 is also defined.
                                        async.eachSeries(sorted, function(version, cb) {
                                            if(semver.lt(version, options.version) && _.any(appliedMigrations, function(m) {
                                                    return m.name === version
                                                })) {
                                                // version below and already migrated
                                                cb()
                                            } else if (semver.lt(version, options.version) &&
                                                (!_.any(appliedMigrations, function(m) { return m.name === version}))) {
                                                // version below but not applied: '
                                                migrations.runUpMigration({ name : version }, cb);
                                            } else if (semver.gt(version, options.version)) {
                                                // version greater must not apply
                                                cb();
                                            } else {
                                                migrations.runUpMigration({ name : options.version }, cb);
                                            }

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
                        console.log('Migration ' + options.version + ' already applied');
                        callback()
                    }
                }
            })
        });





}

module.exports = {up: up};

function up(options, callback) {

    if (semver.valid(options.version)) {

        massiveMigrate({
            connectionString: options.connectionString,
            directory: options.migrationsDirectory
        }, function (err, migrations) {
            if (!err) {
                var massive = require('massive');
                massive.connect({
                    connectionString: options.connectionString, scripts: __dirname + '/db'
                }, function (err, db) {
                    applyMigration(db, migrations, options, callback);
                })
            }
            else {
                if (err) throw err;
                console.log('error: ', err)
            }
        })

    }
}
