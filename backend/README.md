# Blockchain_Transaction_Tracker Developer Manual
블록체인 거래 추적 시스템 - 개발자 메뉴얼

## Database Installation (Docker Version)
1. docker 설치
```shell
$ sudo apt-get install docker
```

2. mongoDB install
```shell
$ docker pull mongo
$ docker run --name test_name \ 
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=USERNAME \ 
    -e MONGO_INITDB_ROOT_PASSWORD=PASSWORD \ 
    -d mongo:latest
    
$ docker exec -it test_name bash
```

## Application Installation
1. github 코드 다운로드
```shell
$ git clone https://github.com/jaeheeLee17/Blockchain_Transaction_Tracker.git
```

2. 애플리케이션 환경 설정
```shell
$ cd Blockchain_Transaction_Tracker/backend
$ cp .env.sample .env
$ cd ../frontend
$ cp .env.sample .env
```

3. 애플리케이션 실행에 필요한 모듈 설치
```shell
$ cd ../backend
$ npm i
$ cd ../frontend
$ yarn install
$ yarn add d3@^5.5.0
$ yarn add react-d3-graph
```

4. 애플리케이션 실행
```shell
$ cd ../backend
$ npm start
```