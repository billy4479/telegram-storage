ARG port=3000

FROM node:alpine
ARG port
WORKDIR /app

ENV PORT ${port}

RUN yarn

ENTRYPOINT "yarn" "dev" "--port" "$PORT" "--host"