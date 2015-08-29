var should = require('chai').should();
var massive = require('massive');
var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
var semverMigration = require('../index');


describe('When running migration from no tables to 0.1.0 with no pgmiration table existing', function () {

    var database;
    beforeEach(function (done) {
        massive.connect({connectionString: conn, scripts: __dirname + '/db'}, function (err, db) {
            db.droptesttables(function(err) {
                database = db;
                done();
            })
        });
    });

    it('should contain 3 tables', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.1.0";
        var version = '0.1.0';
        var migrationScript = '0.1.0-up';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory,
            version: version,
            migrationScript: migrationScript
        };

        semverMigration.up(options, function() {
            massive.connect(database, function(err, db) {
                db.tables.length.should.equal(3);
                db.tables[0].name.should.equal('customer');
                db.tables[1].name.should.equal('pgmigration');
                db.tables[2].name.should.equal('salutation');
                done();
            })
        });
    })
});

describe('When running migration from no tables to 0.2.0 with no pgmigration table existing', function () {

    var database;
    beforeEach(function (done) {
        massive.connect({connectionString: conn, scripts: __dirname + '/db'}, function (err, db) {
            db.droptesttables(function(err) {
                database = db;
                done();
            })
        });
    });

    it('should contain 3 tables', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.2.0";
        var version = '0.2.0';
        var migrationScript = '0.2.0-up';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory,
            version: version,
            migrationScript: migrationScript
        };

        semverMigration.up(options, function() {
            massive.connect(database, function(err, db) {
                db.tables.length.should.equal(3);
                db.tables[0].name.should.equal('customer');
                db.tables[1].name.should.equal('pgmigration');
                db.tables[2].name.should.equal('salutation');
                done();
            })
        });



    })

});