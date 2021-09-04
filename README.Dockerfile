The Dockerfile you can find in this repository aims to create a local docker container.
It can be adapted  to host the container on a remote server. 

Port mapping :
http://localhost:4000 -> asciigrid
(http://localhost:4001 -> bob2svg web service)

Install process for local usage :
mkdir asciigrid
mv Dockerfile asciigrid/
docker build -t asciigrid asciigrid
docker run -p 4000:80 -p 4001:4001 asciigrid
http://localhost:4000
