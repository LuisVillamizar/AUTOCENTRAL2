# deploy production -> ng build --prod --build-optimizer
FROM nginx:1.13.3-alpine
 
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
 
## copy over the artifacts in dist folder to default nginx public folder
COPY dist/ /usr/share/nginx/html/
 
CMD ["nginx", "-g", "daemon off;"]