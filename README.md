# Massive-Migrate-SemVer

Massive-Migrate-SemVer is a small, opinionated migrations library based on [Massive-Migrate](https://github.com/pdmlab/massive-migrate) that can help you implement migrations for Postgres databases using Node.js based on [Semantic Versioning](http://semver.org/) semantics.

## Installation

```bash
npm install massive-migrate-semver --save
```

## Usage

Once installed, you can use it by calling the `up` function of the `massive-migrate-Semver` modules `semVerMigrations`:

```js
var massiveMigrateSemver = require("massive-migrate-semver");
var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations";
        var version = '0.1.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

		 massiveMigrateSemver(options, function(err, semVerMigrations) {
            semVerMigrations.up({ version: version }, function(err) {
            })
        });
```

Assuming you want to do an `up`-migration to version `0.1.0`, you must have the following files and folders available (please look at [Massive-Migrate](https://github.com/pdmlab/massive-migrate) for the basic details):

```
├── migrations
│    └── 0.1.0
│         ├── up
│         │    ├── createcustomertable.sql
│         │    └── createsalutationtable.sql
│         └── 0.1.0-up.js
└── app.js
```

If you run your application which calls the migration, you get this output:

```bash
$ node app.js
created salutation table
created customer table
migration done
```

Your database now contains the two tables as well as a table `pgmigrations`:


```
│    id    │  version  │  scriptname  │  dateapplied  │
├──────────┼───────────┼──────────────┼───────────────┤
│  <guid>  │   0.1.0   │   0.1.0-up   │    <date>     │
```

## Semantic Versioning and Migrations

Let's consider you have two migrations `0.1.0` and `0.2.0` and you want to bootstrap from an empty database to `0.2.0`. With Massive-Migrate-Semver you simply run the `0.2.0` migration and get all migrations run including the `0.1.0` with Semantic Versioning semantics applied.

To get this working, of course, you need to have both Migration files in place:

```
├── migrations
│    ├── 0.1.0
│    │    ├── up
│    │    │    ├── createcustomertable.sql
│    │    │    └── createsalutationtable.sql
│    │    └── 0.1.0-up.js
│    └── 0.2.0
│         ├── up
│         │    └── altercustomertable.sql
│         └── 0.2.0-up.js
└── app.js
```

As said, you just have to call the `0.2.0` Migration in your app:

```js
var massiveMigrateSemver = require("massive-migrate-semver");
var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations";
        var version = '0.2.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

        massiveMigrateSemver(options, function(err, semVerMigrations) {
            semVerMigrations.up({ version: version }, function(err) {
            })
        });
```

Running the app results in this output:


```bash
$ node app.js
created salutation table (0.1.0)
created customer table (0.1.0)
altered customer table (0.2.0)
migration done
```

Your `pgmigration` table now looks like this:

```
│    id    │  version  │  scriptname  │  dateapplied  │
├──────────┼───────────┼──────────────┼───────────────┤
│  <guid>  │   0.1.0   │   0.1.0-up   │    <date>     │
│  <guid>  │   0.2.0   │   0.2.0-up   │    <date>     │
```

## Passing custom params to the up script
If you want to pass custom params to the up script when calling the `up` function, you can do so.

Just apply your custom params to the options object like shown with the `seedTestData` param:

```js
var massiveMigrateSemver = require("massive-migrate-semver");
var conn = "postgresql://postgres:postgres@localhost:5432/postgres";
        var migrationsDirectory = __dirname + "/migrations";
        var version = '0.1.0';

        var options = {
            connectionString: conn,
            migrationsDirectory: migrationsDirectory
        };

		 massiveMigrateSemver(options, function(err, semVerMigrations) {
            semVerMigrations.up({ version: version, seedTestData : true }, function(err) {
            })
        });
```

For more details, please take a look at the tests.

## Running the tests
You can choose two variants to run the tests: against a local Postgres installation or using Postgres in a Docker container.

Without Docker, create a local Postgres database named `postgres` with username and password `postgres`, listening on `localhost:5432`.

Then, run the tests:
```bash
npm test
```

If you want to use Docker with no local Postgres installation required, run your tests like this:

```
npm run dockerpostgres
npm test
```

## Nice, but what's missing?
A lot. Not all semver semantics are currently supported.
Furthermore, down-Migrations are not supported as Massive-Migrate doesn't support them currently).
And there might be unknown bugs...

## Want to help?
This project is just getting off the ground and could use some help with cleaning things up and refactoring.

If you want to contribute - we'd love it! Just open an issue to work against so you get full credit for your fork. You can open the issue first so we can discuss and you can work your fork as we go along.

If you see a bug, please be so kind as to show how it's failing, and we'll do our best to get it fixed quickly.

## License (BSD 3-Clause)

Copyright (c) 2015, PDMLab e.K.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of massive-migrate nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
