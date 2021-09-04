FROM "debian:bullseye"

RUN apt update
RUN apt install -y git apache2 python3 python3-pip
RUN pip3 install markdown_svgbob flask gunicorn
RUN rm /var/www/html/index.html
RUN git clone https://gitlab.com/mbarkhau/asciigrid.git /var/www/html
RUN sed -i
's/https:\/\/mbarkhau.pythonanywhere.com\/bob2svg/http:\/\/localhost:40
01\/bob2svg/g' /var/www/html/app.mjs 


RUN sed -i 's/origin = .*$/origin="*"/g' /var/www/html/app.py

RUN echo "#!/bin/bash" > /var/www/html/start.sh
RUN echo "/etc/init.d/apache2 start" >> /var/www/html/start.sh 
RUN echo "cd /var/www/html" >> /var/www/html/start.sh
RUN echo "/usr/local/bin/gunicorn app:app -b 0.0.0.0:4001" >>
/var/www/html/start.sh
RUN chmod 700 /var/www/html/start.sh

WORKDIR /var/www/html
ENTRYPOINT ["/var/www/html/start.sh"]
