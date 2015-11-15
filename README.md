AUTH
====

create user
-----------
````
curl -H "Content-Type: application/json" -d '{"email":"xyz@foobar.com","password":"abc"}' http://localhost:8080/signup
````
Login
-----
Login will get you a token with which you can request for his protected data
````
curl -H "Content-Type: application/json" -d '{"email":"xyz@foobar.com","password":"abc"}' http://localhost:8080/authenticate
````
Query
-----
Set Authorization header to the token of the user
````
curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInBhc3N3b3JkIjoiJDJhJDA4JDgzUThlOFR6aGljR0tnQjRyQzByL3VOSy9DamtHZW1XNURMelh2VVZ5cnZ1Nk12TjZ4azlpIiwiZW1haWwiOiJ4eXoxIiwiX2lkIjoiNTY0N2ZiZGQyNGY5ZjJhZTVjMjRkM2FmIn0.xW1YxzOzbQOBkzC-bpE2lSDXTgc3pqCVRS_AnrpjAW0"  http://localhost:8080/me
````
