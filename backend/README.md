# Blockchain_Transaction_Tracker Developer Manual
블록체인 거래 추적 시스템 - 개발자 메뉴얼

## Database Installation (Docker Version)


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