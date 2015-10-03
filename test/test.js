var should = require('chai').should();
var massive = require('massive');
var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
var massiveMigrateSemVer = require('../index');


describe('When running migration from no tables to 0.1.0 with no pgmiration table existing', function () {

    var database;
    beforeEach(function (done) {
        massive.connect({connectionString: conn, scripts: __dirname + '/db'}, function (err, db) {
            db.droptesttables(function (err) {
                database = db;
                done();
            })
        });
    });

    it('should contain 3 tables', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.1.0";
        var version = '0.1.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({version: version}, function (err) {
                massive.connect(database, function (err, db) {
                    db.tables.length.should.equal(3);
                    db.tables[0].name.should.equal('customer');
                    db.tables[1].name.should.equal('pgmigration');
                    db.tables[2].name.should.equal('salutation');
                    done();
                })
            })
        });
    });

    it('should seed test data if set to be seeded', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.1.0";
        var version = '0.1.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({version: version, seedTestData : true }, function (err) {
                massive.connect(database, function (err, db) {
                    db.tables.length.should.equal(3);
                    db.tables[0].name.should.equal('customer');
                    db.tables[1].name.should.equal('pgmigration');
                    db.tables[2].name.should.equal('salutation');
                    db.customer.findOne({ companyname1 : 'PDMLab e.K.'}, function(err, result) {
                        should.exist(result);
                        done();
                    });
                })
            })
        });
    })
});

describe('When running migration from no tables to 0.2.0 with no pgmigration table existing', function () {

    var database;
    beforeEach(function (done) {
        massive.connect({connectionString: conn, scripts: __dirname + '/db'}, function (err, db) {
            db.droptesttables(function (err) {
                database = db;
                done();
            })
        });
    });

    it('should contain 3 tables', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.2.0";
        var version = '0.2.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({version: version}, function (err) {
                massive.connect(database, function (err, db) {
                    db.tables.length.should.equal(3);
                    db.tables[0].name.should.equal('customer');
                    db.tables[1].name.should.equal('pgmigration');
                    db.tables[2].name.should.equal('salutation');
                    done();
                })
            })
        });
    });

    it('should seed test data if set to be seeded', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.2.0";
        var version = '0.2.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({version: version, seedTestData : true }, function (err) {
                massive.connect(database, function (err, db) {
                    db.tables.length.should.equal(3);
                    db.tables[0].name.should.equal('customer');
                    db.tables[1].name.should.equal('pgmigration');
                    db.tables[2].name.should.equal('salutation');
                    db.customer.findOne({ companyname1 : 'PDMLab e.K.'}, function(err, result) {
                        should.exist(result);
                        result.active.should.equal(true);
                        done();
                    });
                })
            })
        });
    })

});

describe('When running migration from existing pgmigration table from 0.1.0 to 0.2.0', function () {

    var database;
    beforeEach(function (done) {
        massive.connect({connectionString: conn, scripts: __dirname + '/db'}, function (err, db) {
            db.droptesttables(function (err) {
                database = db;
                done();
            })
        });
    });

    it('should contain 3 tables', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.1.0-0.2.0";
        var version0_1_0 = '0.1.0';
        var version0_2_0 = '0.2.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({ version : version0_1_0}, function (err) {
                semVerMigrations.up({ version: version0_2_0}, function(err) {
                    massive.connect(database, function (err, db) {
                        db.tables.length.should.equal(3);
                        db.tables[0].name.should.equal('customer');
                        db.tables[1].name.should.equal('pgmigration');
                        db.tables[2].name.should.equal('salutation');
                        db.pgmigration.findOne({name: '0.2.0'}, function (err, result) {
                            should.exist(result);
                            result.name.should.equal('0.2.0');
                            done();
                        });
                    })
                })
            })
        });
    });

    it('should seed test data if set to be seeded', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.1.0-0.2.0";
        var version0_1_0 = '0.1.0';
        var version0_2_0 = '0.2.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({ version : version0_1_0, seedTestData : true }, function (err) {
                semVerMigrations.up({ version: version0_2_0, seedTestData : true }, function(err) {
                    massive.connect(database, function (err, db) {
                        db.tables.length.should.equal(3);
                        db.tables[0].name.should.equal('customer');
                        db.tables[1].name.should.equal('pgmigration');
                        db.tables[2].name.should.equal('salutation');
                        db.customer.findOne({ companyname1 : 'PDMLab e.K.'}, function(err, result) {
                            should.exist(result);
                            result.active.should.equal(true);
                            done();
                        });
                    })
                })
            })
        });
    })
});

describe('When running migration from existing pgmigration table from 0.1.0 to 0.3.0', function () {

    var database;
    beforeEach(function (done) {
        massive.connect({connectionString: conn, scripts: __dirname + '/db'}, function (err, db) {
            db.droptesttables(function (err) {
                database = db;
                done();
            })
        });
    });

    it('should contain 4 tables', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.1.0-0.3.0";
        var version0_1_0 = '0.1.0';
        var version0_3_0 = '0.3.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({ version: version0_1_0}, function (err) {
                semVerMigrations.up( {version : version0_3_0}, function(err) {
                    massive.connect(database, function (err, db) {
                        db.tables.length.should.equal(4);
                        db.tables[0].name.should.equal('customer');
                        db.tables[1].name.should.equal('pgmigration');
                        db.tables[2].name.should.equal('salutation');
                        db.pgmigration.findOne({name: '0.3.0'}, function (err, result) {
                            should.exist(result);
                            result.name.should.equal('0.3.0');
                            db.pgmigration.find({}, function (err, allresult) {
                                allresult.length.should.equal(3);
                                done();
                            });
                        });
                    })
                })
            })
        });
    });

    it('should seed test data if set to be seeded', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.1.0-0.3.0";
        var version0_1_0 = '0.1.0';
        var version0_3_0 = '0.3.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({ version: version0_1_0, seedTestData : true }, function (err) {
                semVerMigrations.up( {version : version0_3_0, seedTestData : true }, function(err) {
                    massive.connect(database, function (err, db) {
                        db.tables.length.should.equal(4);
                        db.tables[0].name.should.equal('customer');
                        db.tables[1].name.should.equal('pgmigration');
                        db.tables[2].name.should.equal('salutation');
                        db.customer.findOne({ companyname1 : 'PDMLab e.K.'}, function(err, result) {
                            should.exist(result);
                            result.active.should.equal(true);
                            db.supplier.findOne({ companyname1 : 'PDMLab e.K.'}, function(err, result) {
                                should.exist(result);
                                done();
                            });
                        });
                    })
                })
            })
        });
    })
});

describe('When running migration from existing pgmigration table from 0.2.0 to 0.3.0', function () {

    var database;
    beforeEach(function (done) {
        massive.connect({connectionString: conn, scripts: __dirname + '/db'}, function (err, db) {
            db.droptesttables(function (err) {
                database = db;
                done();
            })
        });
    });

    it('should contain 4 tables', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.2.0-0.3.0";
        var version0_2_0 = '0.2.0';
        var version0_3_0 = '0.3.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };


        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({ version: version0_2_0}, function (err) {
                semVerMigrations.up({ version: version0_3_0}, function(err) {
                    massive.connect(database, function (err, db) {
                        db.tables.length.should.equal(4);
                        db.tables[0].name.should.equal('customer');
                        db.tables[1].name.should.equal('pgmigration');
                        db.tables[2].name.should.equal('salutation');
                        db.pgmigration.findOne({name: '0.3.0'}, function (err, result) {
                            should.exist(result);
                            result.name.should.equal('0.3.0');
                            db.pgmigration.find({}, function (err, allresult) {
                                allresult.length.should.equal(3);
                                done();
                            });
                        });
                    })
                })
            })
        });
    });

    it('should seed test data if set to be seeded', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.2.0-0.3.0";
        var version0_2_0 = '0.2.0';
        var version0_3_0 = '0.3.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };


        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({ version: version0_2_0, seedTestData : true }, function (err) {
                semVerMigrations.up({ version: version0_3_0, seedTestData : true }, function(err) {
                    massive.connect(database, function (err, db) {
                        db.tables.length.should.equal(4);
                        db.tables[0].name.should.equal('customer');
                        db.tables[1].name.should.equal('pgmigration');
                        db.tables[2].name.should.equal('salutation');
                        db.customer.findOne({ companyname1 : 'PDMLab e.K.'}, function(err, result) {
                            should.exist(result);
                            result.active.should.equal(true);
                            db.supplier.findOne({ companyname1 : 'PDMLab e.K.'}, function(err, result) {
                                should.exist(result);
                                done();
                            });
                        });
                    })
                })
            })
        });
    })
});

describe('When running migration from existing pgmigration table from 0.1.0 through 0.2.0 to 0.3.0', function () {

    var database;
    beforeEach(function (done) {
        massive.connect({connectionString: conn, scripts: __dirname + '/db'}, function (err, db) {
            db.droptesttables(function (err) {
                database = db;
                done();
            })
        });
    });

    it('should contain 4 tables', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.1.0-0.2.0-0.3.0";
        var version0_1_0 = '0.1.0';
        var version0_2_0 = '0.2.0';
        var version0_3_0 = '0.3.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({ version : version0_1_0}, function (err) {
                semVerMigrations.up({ version: version0_2_0}, function (err) {
                    semVerMigrations.up({ version: version0_3_0}, function(err) {
                        massive.connect(database, function (err, db) {
                            db.tables.length.should.equal(4);
                            db.tables[0].name.should.equal('customer');
                            db.tables[1].name.should.equal('pgmigration');
                            db.tables[2].name.should.equal('salutation');
                            db.pgmigration.findOne({name: '0.3.0'}, function (err, result) {
                                should.exist(result);
                                result.name.should.equal('0.3.0');
                                db.pgmigration.find({}, function (err, allresult) {
                                    allresult.length.should.equal(3);
                                    done();
                                });
                            });
                        })
                    })
                })
            });
        });
    });

    it('should seed test data if set to be seeded', function (done) {
        var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations/none-0.1.0-0.2.0-0.3.0";
        var version0_1_0 = '0.1.0';
        var version0_2_0 = '0.2.0';
        var version0_3_0 = '0.3.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemVer(options, function (err, semVerMigrations) {
            semVerMigrations.up({ version : version0_1_0, seedTestData : true }, function (err) {
                semVerMigrations.up({ version: version0_2_0, seedTestData : true }, function (err) {
                    semVerMigrations.up({ version: version0_3_0, seedTestData : true }, function(err) {
                        massive.connect(database, function (err, db) {
                            db.tables.length.should.equal(4);
                            db.tables[0].name.should.equal('customer');
                            db.tables[1].name.should.equal('pgmigration');
                            db.tables[2].name.should.equal('salutation');
                            db.customer.findOne({ companyname1 : 'PDMLab e.K.'}, function(err, result) {
                                should.exist(result);
                                result.active.should.equal(true);
                                db.supplier.findOne({ companyname1 : 'PDMLab e.K.'}, function(err, result) {
                                    should.exist(result);
                                    done();
                                });
                            });
                        })
                    })
                })
            });
        });
    })
});