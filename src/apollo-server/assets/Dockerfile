FROM node:14
ARG GPR_ACCESS_TOKEN
WORKDIR /app

# Put global .npmrc file in the user home folder
RUN echo "@worldcoin:registry=https://npm.pkg.github.com/" > /root/.npmrc \
  && echo "//npm.pkg.github.com/:_authToken=${GPR_ACCESS_TOKEN}" >> /root/.npmrc

COPY . .
RUN npm install
RUN npm run build
CMD "npm" "run" "start"
