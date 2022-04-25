FROM node:16-alpine
WORKDIR /usr/src/app
COPY .github/workflows/entrypoint.sh .
COPY . .
RUN npm ci
RUN npm run build
RUN apk add tini
ENTRYPOINT ["tini", "--"]
CMD ["/usr/src/app/entrypoint.sh"]