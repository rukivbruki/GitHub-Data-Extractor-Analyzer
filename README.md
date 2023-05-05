LAUNCH OF CONTAINERIZED APPLICATION:

Console utility:

1. Clone the repository.
2. Obtain an access token on the GitHub platform (https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token).
3. Add a .env file in the root folder of the backend and include the directive TOKEN = your_token.
4. Create and run the application container (do not close the tab):
    - docker-compose build
    - docker-compose up
5. In a new tab from the project directory, run the command `docker ps` and copy the ID of the running container (container_ID).
6. Run the command `docker exec -it container_ID /bin/bash`.
7. Run the command `npm run crawler`.
Note: To successfully save data to the local machine, you need to grant Docker access to the folder where MongoDB saves data. In our case, this is: /usr/local/var/mongodb

Web client:

1. Follow steps 1-3 from the console application launch instruction.
2. Go to http://localhost:8080/ and use the web interface to start the application.

LAUNCH OF LOCAL APPLICATION:

Console utility:

1. Install the npm package manager, Node.js platform, and MongoDB database in your system.
2. Start MongoDB.
3. Follow steps 1-3 from the containerized application launch instruction.
4. From the backend folder, run the command `node service/service --crawler` (you can specify the logging level as the second parameter, for example, DEBUG or ERROR).

Web client:

1. Install the npm package manager, Node.js platform, and MongoDB database in your system.
2. Start MongoDB.
3. Follow steps 1-3 from the containerized application launch instruction.
4. From the backend folder, run the command `node service/service --server` (you can specify the logging level as the second parameter, for example, DEBUG or ERROR).
5. From the frontend folder, run the command `npm run serve`.
6. Go to http://localhost:8080/ and use the web interface to start the application.
