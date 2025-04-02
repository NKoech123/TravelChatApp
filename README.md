# Welcome to Travel Chat App 👋

## Tech UseD
1. React (For Web)
2. Expo React Native (For mobile)
3. Redux (State Management)
4. Fastify API
5. Swagger UI (API documentation)
6. Dockerized Postgres
7. Prisma ORM

## Architecture

<img width="1060" alt="Screenshot 2025-04-02 at 4 43 24 AM" src="https://github.com/user-attachments/assets/fd3d8b93-9f1f-4332-beb0-ce609ae96731" />


## API Documentation

![image](https://github.com/user-attachments/assets/5d027dce-fc72-4a39-a9f7-cf4f74d8cd2e)

## Web View
[**Travel Chat App – 2 April 2025 – Watch Video**](https://www.loom.com/share/983f93e322994f019342f574c0668a40)

[![Watch the video](https://cdn.loom.com/sessions/thumbnails/983f93e322994f019342f574c0668a40-e71ecc4a04814c70-full-play.gif)](https://www.loom.com/share/983f93e322994f019342f574c0668a40)

## Mobile (React native) View:
## 📱 Mobile Demo – Travel Chat App

[**Watch on Loom**](https://www.loom.com/share/e736d2e43e7244d3afc575fbdd7af74f?sid=b99f6c65-c125-4f0a-b802-c7d81a2c1bda)

[![Watch the video](https://cdn.loom.com/sessions/thumbnails/e736d2e43e7244d3afc575fbdd7af74f-with-play.gif)](https://www.loom.com/share/e736d2e43e7244d3afc575fbdd7af74f?sid=b99f6c65-c125-4f0a-b802-c7d81a2c1bda)

<img width="214" alt="Screenshot 2025-04-02 at 10 39 39 AM" src="https://github.com/user-attachments/assets/9003c8ce-0cad-4761-871e-25b37115d86e" />
<img width="218" alt="Screenshot 2025-04-02 at 10 39 18 AM" src="https://github.com/user-attachments/assets/e41648cc-16fa-421b-81a5-5e9d57e686e2" />
<img width="218" alt="Screenshot 2025-04-02 at 10 38 38 AM" src="https://github.com/user-attachments/assets/b212238a-654e-4ac7-8e12-0c86dce76286" />


 
## Get started
0. Ensure docker is installed in your machine. Also have these in your `.env`
  ```bash
    DATABASE_URL="postgresql://postgresUser:postgresPW@localhost:5455/postgres?schema=public"
    OPENAI_API_KEY="xxxxx-your-key-xxxxxxxx"
  ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Run Fastify API

    ```bash
     npm run api
    ```
4.  Seed some data initial chats and most important a default user to use for server request contexts

    ```bash
     npm run data-model-postgres
    ```

3. Run Client
   For Web (easy for testing - I recommend this for testing)  run:

```bash
 npm run web: dev
```
  For mobile(Expo): 
  ```bash
 npm run start
```

5. TBD: Upload UI Screenshots

