FROM ruby:2.7

LABEL description="Hosts the OpenProject documentation."
LABEL maintainer="operations@openproject.com"

RUN apt-get update -qq && apt-get install -y \
    curl git nginx && apt-get clean

RUN curl -L https://nodejs.org/dist/v12.19.0/node-v12.19.0-linux-x64.tar.gz -o- | tar xzf - --strip=1 -C /usr/local

ENV DOCS_PATH=/tmp/build/docs
WORKDIR $DOCS_PATH

COPY package.json package-lock.json ./
RUN JOBS=max npm install
COPY Gemfile Gemfile.lock ./
RUN bundle install -j$(nproc)

ARG ORIGIN="https://github.com/opf/openproject"
ARG BRANCH=dev

ENV ROBOTS_ALLOWED=true
ENV MATOMO_ENABLED=false
ENV GTM_ID=""
ENV HUBSPOT_PORTAL_ID=""
ENV OPENPROJECT_CORE=/tmp/build/core
# Disable Ruby warnings while many still spit 2.7 deprecation warnings
ENV RUBYOPT="-W0"

RUN git clone --depth=1 --branch "$BRANCH" $ORIGIN /tmp/build/core

COPY . ./

ENV SITE_URL="http://mywebsite.com"
RUN bundle exec rake build
RUN NO_CONTRACTS=true bundle exec middleman build

RUN echo "BUILDINFO" && cat data/buildinfo.yml
RUN echo "BUILDINFO ON PAGE" && cat build/index.html | grep 'Build '

RUN rm -rf /usr/share/nginx/html && mv build /usr/share/nginx/html

COPY ./docker /docker
ENTRYPOINT ["/docker/entrypoint.sh"]
