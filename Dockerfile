FROM node:carbon
WORKDIR /home/sadmin/frontEnd/server-gateway

# Bundle app source
COPY server-gateway /home/sadmin/frontEnd/
CMD ["npm", "start"]
EXPOSE 7052