FROM node:16-alpine
COPY .github/workflows/entrypoint.sh .
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build
RUN apk add tini
ENTRYPOINT ["tini", "--"]
CMD ["entrypoint.sh"]