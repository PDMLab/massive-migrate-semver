var semver = require('semver');
var massive = require('massive');
var Migration = require('massive-migrate');
var fs = require('fs');
var serialization = require('typewise-semver');
var parse = serialization.parse;
var stringify = serialization.stringify;
var bytewise = require('bytewise-core');


function orderMigrations(results) {
    var migrations = {};

    for (var i = 0; i < results.length; i++) {
        var splitted = results[i].split('.');
        for(var j=0;j<splitted.length;j++) {
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

module.exports.up = function (options, callback) {

    if (semver.valid(options.version)) {
        massive.connect({connectionString: options.connectionString, scripts: __dirname + '/db'}, function (err, db) {
            if (!err) {
                var migrationTableExist = false;
                for (var i = 0; i < db.tables.length; i++) {
                    if (db.tables[i].name === 'pgmigration') {
                        migrationTableExist = true;
                    }
                }


                fs.readdir(options.migrationsDirectory, function (err, results) {
                    var sorted = orderMigrations(results);

                    if (migrationTableExist) {
                        db.pgmigration.findOne({version: options.version}, function (err, exitstingMigration) {
                            if (!err) {
                                console.log('migration', exitstingMigration);
                                if (typeof exitstingMigration === typeof undefined) {

                                    console.log(sorted.indexOf(options.version));

                                    // last migration?
                                    if(sorted.indexOf(options.version) === sorted.length-1) {

                                        var migration = new Migration(
                                            options.connectionString,
                                            options.migrationsDirectory,
                                            options.version, function () {
                                                migration.up(options.migrationScript);
                                            });
                                    }

                                } else {
                                    console.log('Migration ' + options.version + ' already applied')
                                }
                            }
                        })
                    }


                });

            }
        });

        if (callback) {
            callback()
        }
    }


};