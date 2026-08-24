---
type: "query"
date: "2026-08-23T18:28:17.975893+00:00"
question: "i already publish this project online. how to login into admin ? do i need to create new user ?"
contributor: "graphify"
source_nodes: [".seedAdmin()", "DatabaseSeeder", "Login()", "User"]
---

# Q: i already publish this project online. how to login into admin ? do i need to create new user ?

## Answer

Expanded from original query via graph vocab: [admin, auth, database, email, login, password, seed, seeder, user]. Production has no public registration. The single owner account must exist in the production users table. DatabaseSeeder.seedAdmin creates or updates it when ADMIN_PASSWORD is configured, while /admin is protected and redirects guests to /login. On an already populated site, avoid the full DatabaseSeeder because PortfolioContentSeeder deletes and recreates portfolio content; create/update only the owner record instead.

## Source Nodes

- .seedAdmin()
- DatabaseSeeder
- Login()
- User