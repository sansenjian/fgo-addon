FROM golang:1.26-alpine AS build
WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o fgo-server .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=build /app/fgo-server .
EXPOSE 3000
ENV TZ=Asia/Shanghai
CMD ["./fgo-server"]
