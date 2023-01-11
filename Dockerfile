FROM node:16.18.1 AS mofe
ARG envflag=newmodev
ENV NODE_OPTIONS="--max_old_space_size=2700"
WORKDIR /opt/
COPY ./package.json /opt/
RUN npm install node-sass
RUN npm install --ignore-scripts
ENV PATH="./node_modules/.bin:$PATH"
COPY . ./
RUN npm uninstall -g typescript
RUN npm install typescript@4.6.4 --save-dev
RUN ng build -c=${envflag}


FROM nginx
COPY default.conf /etc/nginx/conf.d/default.conf
COPY default2.conf /etc/nginx/conf.d/default2.conf
COPY --from=mofe /opt/dist /opt/
EXPOSE 80 8080
