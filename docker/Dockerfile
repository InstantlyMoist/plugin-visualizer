FROM node:20-bookworm AS build

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN rm -rf node_modules

RUN pnpm install

ENV NODE_ENV=production

RUN pnpm run build
# RUN ["sleep", "infinity"]

FROM node:20-bookworm AS production

# Create app directory
WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/.nuxt ./.nuxt

CMD ["node", "./.output/server/index.mjs"]

