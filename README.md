# NexusNarrative
## blogging site


## to build
```sh
docker build -t nexus-narrative .
```

## to inspect image
```sh
docker run -it --rm --entrypoint /bin/sh nexus-narrative
```

## to run
```sh
 docker run -d -p 8080:8080 nexus-narrative
```



# RESTapi

GET /api/user/{blogName}
    return user info

POST /api/auth/login
    login to your account

POST /api/auth/sing-up
    create new user account

PATCH /api/auth/account-verification
    verification user account be comparing user entered code and the sent code to the email

PATCH /api/auth/forgat-password
    send verification code to the specified email in request

PATCH /api/auth/reset-password
    comparing user entered code and the sent code to the email and change the current password into the new password

DELETE /api/auth/logout
    logout the user
