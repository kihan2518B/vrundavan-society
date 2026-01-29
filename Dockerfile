ARG NODE_VERSION=22.12.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}

# Set working directory for all build stages.
WORKDIR /app

ENV NODE_ENV development

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/

RUN npm ci

COPY . .

EXPOSE 3000

CMD npm run dev

