FROM eclipse-temurin:17.0.14_7-jre@sha256:bab05e3e76da235339d6a3ebadb72d238fda66b459434ab5596f2223adb0726e

WORKDIR /app

ENV JAVA_ENABLE_DEBUG=${JAVA_ENABLE_DEBUG}
ENV JAR=devops-knowledge-share-api.jar

COPY entrypoint.sh .
COPY ./build/libs/${JAR} .

RUN groupadd --system appuser -g 1001 && \
    useradd --system -g appuser -u 1001 appuser && \
    mkdir -p /app/data && \
    chown -R appuser:appuser /app && \
    chown appuser:appuser ${JAR} && \
    chmod 500 ${JAR}

EXPOSE 8080
USER 1001

CMD ["./entrypoint.sh"]
