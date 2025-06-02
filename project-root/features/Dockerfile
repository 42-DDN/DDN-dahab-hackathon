FROM python:3.11-slim

WORKDIR /features_app

COPY requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . . 

EXPOSE 5000

CMD ["flask", "--app", "backend", "run", "--host=0.0.0.0", "--port=5000"]

