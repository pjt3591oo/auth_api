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

* KMS

```sh
# 마스터 키 생성
$ aws --endpoint-url=http://localhost:4566 kms create-key --description [이름, 설명]
```

```sh
# 목록 조회
$ aws --endpoint-url=http://localhost:4566 kms list-keys
{
    "Keys": [
        {
            "KeyId": "f540b254-069f-4393-8158-73b2ad234700",
            "KeyArn": "arn:aws:kms:us-east-1:000000000000:key/f540b254-069f-4393-8158-73b2ad234700"
        }
    ]
}
```

```sh
# 상세조회
$ aws --endpoint-url=http://localhost:4566 kms describe-key --key-id f540b254-069f-4393-8158-73b2ad23470
```

```sh
# 암호화
$ aws --endpoint-url=http://localhost:4566 kms encrypt --key-id 'f540b254-069f-4393-8158-73b2ad234700' --plaintex 'mung

{
    "CiphertextBlob": "ZjU0MGIyNTQtMDY5Zi00MzkzLTgxNTgtNzNiMmFkMjM0NzAwu65IE5JqSFopgrA2NUviwAAAAAAAAAAAAAAAAAAAAACihNVlmEkr1lhMto2FEFgy",
    "KeyId": "f540b254-069f-4393-8158-73b2ad234700"
}

# 복호화
$ aws --endpoint-url=http://localhost:4566 kms decrypt --key-id 'f540b254-069f-4393-8158-73b2ad234700' --ciphertex 'ZjU0MGIyNTQtMDY5Zi00MzkzLTgxNTgtNzNiMmFkMjM0NzAwu65IE5JqSFopgrA2NUviwAAAAAAAAAAAAAAAAAAAAACihNVlmEkr1lhMto2FEFgy'
```

* s3

```sh
# 버킷 생성
$ aws --endpoint-url http://localhost:4566 s3 mb s3://[버킷이름]
```

```sh
# 버킷 목록 조회
$ aws --endpoint-url http://localhost:4566 s3 ls
2023-03-06 09:25:13 mung-bucket
```

```sh
# 버킷 상세 조회
$ aws --endpoint-url http://localhost:4566 s3 ls s3://[버킷이름]
```