FROM postgres:latest

ENV POSTGRES_PASSWORD 123
ENV POSTGRES_DB nest
ENV POSTGRES_USER postgres

EXPOSE 22
EXPOSE 80