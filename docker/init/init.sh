#!/bin/bash

# DDLでテーブルを作成する
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/ddl.sql"

# データを流し込む
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/m_address.sql"
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/m_category.sql"
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/t_review.sql"
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/t_shop_category.sql"
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/t_shop.sql"
mysql -u root -proot < "/docker-entrypoint-initdb.d/sql/t_user.sql"