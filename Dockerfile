FROM node:18

# Create app directory
WORKDIR /usr/src/app

ENV PORT 8080
ENV PACKAGE false
ENV QUIT_AFTER_FINISH true
ENV MANUAL_DRIVER_PATH true
ENV JWT_ACCESS_SECRET sarance
ENV MAILER_FROM=saranshbalyan1234@gmail.com

ENV DATABASE_USER 
ENV DATABASE_PASS 
ENV DATABASE_HOST 
ENV DATABASE_NAME automation_master
ENV GUI false

# Install app dependencies
COPY /package*.json ./
RUN npm install --silent
# RUN npm install pm2 -g

# Bundle app source
COPY . .

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \ 
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get -y install google-chrome-stable

# RUN npm i -g webdriver-manager
# RUN webdriver-manager update
# RUN webdriver-manager status

EXPOSE 8080
USER nobody

    
#scaling
# CMD ["pm2-runtime", "index.js","--no-daemon", "-i","-0"]
CMD [ "node", "index.js" ]