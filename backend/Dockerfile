FROM python:3.11
ARG ENVIRONMENT=development # default value

ENV PYTHONPATH="${PYTHONPATH}:/"

ENV PIP_ROOT_USER_ACTION=ignore

ENV TZ=America/Sao_Paulo

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY ./app/. ./

RUN pip install -q --upgrade pip

RUN pip install -q --no-cache-dir --upgrade -r ./requirements/$ENVIRONMENT.txt

EXPOSE 80


CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--reload", "info", "--use-colors", "--ws-ping-timeout=-1", "--ws-ping-interval=300"]
