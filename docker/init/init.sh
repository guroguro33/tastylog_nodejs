#!/bin/bash

# 認証方式を変更
mysql -u root -proot -e "ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'root'"

# DDLでテーブルを作成する
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/ddl.sql"

# データを流し込む
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/m_address.sql"
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/m_category.sql"
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/t_review.sql"
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/t_shop_category.sql"
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/t_shop.sql"
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/t_user.sql"