FROM node:17-alpine
RUN apk add tini
ENTRYPOINT ["tini", "--"]
WORKDIR /usr/src/app
COPY . .
RUN npm run build
CMD ["node", "/usr/src/app/dist/main"]