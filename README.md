# 인증 & 인가 시스템

* 환경변수

```
NODE_ENV=local_dev
JWT_KEY=asdfjksfdj12348762!@*()&1A2J3S4I5Ma
PORT=3000

# 암호화 정보(평문) - KMS로 암호화 하여 관리됨
# KEY: akciaixnsowmfich12340987qwerplki
# IV: abcdef0123456789
ENCRYPTION_KEY=MmZjMzMyOTYtMGVkZS00NTk3LThiMzAtOTFhNGYxN2JjNjY02+hbKV4Dli9OIiipBF010gAAAAAAAAAAAAAAAAAAAAD+bBV690ykkcKRGbSbnLdLcX9qvIgH3wPIogyTLPqkTm38EIgP4nFIBqz/oLD+yFQ=
ENCRYPTION_IV=MmZjMzMyOTYtMGVkZS00NTk3LThiMzAtOTFhNGYxN2JjNjY0QbPCjdgLRTR0iw9+i+SzRAAAAAAAAAAAAAAAAAAAAACLZ5VfoLEvsmOI+dFvot+Huq2jMWMDa4iTNgTCZG7cpw==

# 디비 환경변수
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_DATABASE=my_service

# AWS 환경변수
AWS_HOST=http://127.0.0.1:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1

# AWS KMS 정보
AWS_KMS_KEY_ID=2fc33296-0ede-4597-8b30-91a4f17bc664
```

* db, localstack 실행

```sh
$ docker-compose up
```