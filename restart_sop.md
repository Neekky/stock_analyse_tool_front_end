- 重启后的操作，
1. 首先杀掉占用80端口的应用，
    sudo systemctl stop httpd
    sudo systemctl stop httpd.socket
    sudo systemctl disable httpd.socket

    如果还没杀掉说明有残存
    ps aux | grep httpd

2. 启动nginx服务
sudo systemctl start nginx
/usr/local/nginx/sbin/nginx

3. 启动自己的项目
进到目录下
pm2 start server.cjs --name "stock_analyse_front_server"
sudo systemctl start flaskapp.service
pm2 start www --name "stock_analyse_end_server"

- 查看自动化运行命令，去github和网站上查看是否运行过了
crontab -l

- 查看flask服务的配置文件，文件位置
cat /etc/systemd/system/flaskapp.service
