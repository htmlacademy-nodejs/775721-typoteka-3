## Front server

`FRONT_SERVER_DEFAULT_PORT` - порт фронт сервера;  
`API_SERVER_URL` - url api сервера;  

## Api server

`API_SERVER_DEFAULT_PORT` - порт api сервера;   

## СУБД

`DB_HOST` - хост;  
`DB_PORT` - порт;  
`DB_USER_NAME` - имя пользователя;  
`DB_NAME` - название БД;  
`DB_PASSWORD` - пароль; 

## СУБД для тестов

`TEST_DB_HOST` - хост;  
`TEST_DB_PORT` - порт;  
`TEST_DB_USER_NAME` - имя пользователя;  
`TEST_DB_NAME` - название БД;  
`TEST_DB_PASSWORD` - пароль;  

## Безопасность

`PASSWORD_SALT_ROUNDS` - коэффициент сложности хеширования
`JWT_ACCESS_SECRET` - секрет для основного токена
`JWT_REFRESH_SECRET` - секрет для refresh токена
`JWT_EXPIRES_IN` - время жизни основного токена в секундах

## Хранение файлов

`UPLOAD_DIR` - путь до папки, где хранятся пользовательские файлы
