# 인증 & 인가 시스템

* 환경변수

AWS_KMS_KEY_ID와 ENCRYPTION_KEY, ENCRYPTION_IV 생성방법은 아래에서 다룬다.

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

여기서는 `token-blacklist-backup` 생성한다.

```sh
$ aws --endpoint-url http://localhost:4566 s3 mb s3://token-blacklist-backup
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

### 토큰 블랙 리스트 처리

토큰 블랙 리스트에 등록된 항목중 특정 기간 이전의 토큰은 삭제처리 후 s3 저장소로 백업한다.

### 암/복호화를 위해 CLI 제공

```bash
npm run cli:crypto -- --help

> auth_api@0.0.1 cli:crypto
> ts-node -r tsconfig-paths/register src/cli.ts crypto --help

Usage: cli crypto [options]

crypto management

Options:
  -ue, --user-encrypt [plaintext]   plaintext for encrypt
  -ud, --user-decrypt [ciphertext]  ciphertext for decrypt
  -de, --dek-encrypt [plaintext]    plaintext for decrypt with kms
  -dd, --dek-decrypt [ciphertext]   ciphertext for decrypt with kms
  -h, --help                        display help for command
```

* 암/복호화를 위해 환경 변수 설정 확인

```
# 암호화 정보
ENCRYPTION_KEY=Yzk5Y2FhZDUtNTgwYy00YTk2LTg2ODktODAxMTYxOTJhZDk1fNd/BpaUXNCxJ2VeMa9n+gAAAAAAAAAAAAAAAAAAAABtUY2mvoKEEXkdqwxP1CsYeVan3dyjzdOUNnye4eLZoZoiHw2r6TBC6wbwWFccsg8=
ENCRYPTION_IV=Yzk5Y2FhZDUtNTgwYy00YTk2LTg2ODktODAxMTYxOTJhZDk1i4gMTsPyjpEEdZUceHMWAwAAAAAAAAAAAAAAAAAAAAA5IZFXyD3bXUL578OrMeU1qAgXzvEf54uixav2oo375Q==

# AWS 환경변수
AWS_HOST=http://127.0.0.1:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1

# AWS KMS 정보
AWS_KMS_KEY_ID=c99caad5-580c-4a96-8689-80116192ad95
```

* AWS_KMS_KEY_ID

해당 변수는 KMS에서 마스터 키를 생성하여 발급된 KEY_ID를 넣어준다.

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

* ENCRYPTION_KEY, ENCRYPTION_IV
DEK로 사용되는 ENCRYPTION_KEY와 ENCRYPTION_IV는 KMS를 이용하여 암호화를 한다.

```
key: akciaixnsowmfich12340987qwerplki
iv: abcdef0123456789
```

```
$ npm run cli:crypto -- -de akciaixnsowmfich12340987qwerplki

> auth_api@0.0.1 cli:crypto
> ts-node -r tsconfig-paths/register src/cli.ts crypto -de akciaixnsowmfich12340987qwerplki

[암호화 결과 ENCRYPTION_KEY 저장]

$ npm run cli:crypto -- -de abcdef0123456789

> auth_api@0.0.1 cli:crypto
> ts-node -r tsconfig-paths/register src/cli.ts crypto -de abcdef0123456789

[암호화 결과 ENCRYPTION_IV 저장]
```