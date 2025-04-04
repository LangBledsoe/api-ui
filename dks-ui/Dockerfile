FROM node:20-alpine3.19@sha256:1cc9088b0fbcb2009a8fc2cb57916cd129cd5e32b3c75fb12bb24bac76917a96 AS base

####################################################################################################
# Development stage: Install development dependencies
####################################################################################################
FROM base AS dev

WORKDIR /app

# hadolint ignore=DL3018
RUN apk add --no-cache \
      zsh=5.9-r2 \
      curl=8.5.0-r0 \
      wget=1.21.4-r0 \
      git=2.43.0-r0 \
      openssh=9.6_p1-r0 \
      chromium-chromedriver && \
    sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

####################################################################################################
# Dependencies stage: Perform clean installation of dependencies
####################################################################################################
FROM base AS deps

RUN apk add --no-cache \
      gcompat=1.1.0-r4

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

####################################################################################################
# Builder stage: Build the source code
####################################################################################################
FROM base AS builder

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run validateBuild && \
    npm prune --production

####################################################################################################
# Runner stage: Copy the built application
####################################################################################################
FROM base AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next && \
    chmod 755 .next

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV HOSTNAME 0.0.0.0

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
