-- The test suite runs against MySQL rather than SQLite, so that a dialect
-- difference cannot hide a bug until production. It needs its own database:
-- RefreshDatabase migrates and truncates whatever it is pointed at, and
-- pointing it at `portfolio` would wipe the development content.
--
-- MySQL's entrypoint only creates MYSQL_DATABASE and only grants the
-- application user rights on that one, so both steps are done here.
--
-- Scripts in /docker-entrypoint-initdb.d run only when the data directory is
-- first initialised. On a stack whose volume already exists, run this by hand:
--   docker compose exec db mysql -uroot -psecret < docker/mysql/init/01-test-database.sql
CREATE DATABASE IF NOT EXISTS portfolio_test
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON portfolio_test.* TO 'portfolio'@'%';

FLUSH PRIVILEGES;
