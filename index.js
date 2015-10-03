var massiveMigrate = require('massive-migrate');
var SemVerMigrations = require('./lib/semvermigrations');

var massiveMigrateSemVer = function (options, callback) {
    massiveMigrate({
        connectionString: options.connectionString,
        directory: options.migrationsDirectory
    }, function (err, migrations) {
        callback(err, new SemVerMigrations(migrations, options))
    })
};


module.exports = massiveMigrateSemVer;

