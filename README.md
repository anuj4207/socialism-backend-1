## Description
Socialism Application backend on NestJs framework. 

## Work Links
1. Miro(System Design) - https://miro.com/app/board/uXjVMg8Iaz0=/?share_link_id=869934125017
2. Figma(UI) - https://www.figma.com/file/u2jToL7lXVmMd0cSQUZGYM/socialism_ui?type=design&node-id=0%3A1&mode=design&t=IWtXOmEihBQKVcHP-1

## Installation

```bash
$ npm install
```
## Pre-requisite
- Postgres DB server
```bash
docker run -d -p 5432:5432 --env POSTGRES_USER=postgres --env POSTGRES_PASSWORD=123 --env POSTGRES_DB=nest postgres
```
- Google Cloud Bucket service
  - Create Cloud Bucket with new service account.
  - Download ssh.json service account file for cloud bucket.

## Enviornment 
```bash
DATABASE URL = 'Postgres DB Server link'
JWT_SERCRET = 'Authentication sercret'
#Cloud
BUCKET_KEY_FILE_NAME = 'ssh.json file location'
BUCKET_NAME = 'bucket name'
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```



