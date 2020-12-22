FROM node:15.4-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm install -g @angular/cli

RUN ng build --output-path=/dist

FROM nginx:1.19-alpine as run

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /dist /usr/share/nginx/html

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
