# emptracker

Objective:
---------

The main objective of this application is manage employees by providing following Functionality. 
1. Add, Update, patch, Delete Employee 
2. Add, Update, delete Role
3. Add, Update, delete Department

Github:
------
https://github.com/tanujjain2015/emptracker 

Recording Demo:
--------------
Link1:  https://drive.google.com/file/d/1VDSzG2yjWgNgteQp6JuBcq6Bgo9Z7wVo/view 
Link2:  https://drive.google.com/file/d/16ITTbyCxxj4iADZIL0MQ9JshQ28CSixE/view


Usage: 
------

1. Execute "npm install"
2. Create ".env" file with following values:
    1. db_passwd = <mysql root password>
    2. baseURL = <local host url>
3. open terminal and enter npm start. By default server will run on port 80. if you want to change server port then modify line 4 in server.js
4. open another terminal and execute "node index.js"
    a) Select options and take necessary action. 

Technology Used:
---------------
1.  mysql db
2.  Pool Connection
3.  web server creation through Express and routing 



