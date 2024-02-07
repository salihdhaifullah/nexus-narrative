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
