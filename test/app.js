var semverMigration = require('../index');
var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
var migrationsDirectory = __dirname + "/migrations";
var version = '0.2.0';
var migrationScript = '0.2.0-up';

var options = {
    connectionString : conn,
    migrationsDirectory : migrationsDirectory,
    version : version,
    migrationScript : migrationScript
};

semverMigration.up(options, function(err) {
    console.log('callback');
    if(!err) {
        console.log('done')
    }
});