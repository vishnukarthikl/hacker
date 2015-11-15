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


