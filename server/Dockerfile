# ---- Build stage ----
FROM golang:1.24 AS build
WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64
RUN go build -trimpath -ldflags="-s -w" -buildvcs=false -o /out/app ./server.go

# ---- Run stage (distroless) ----
FROM gcr.io/distroless/static-debian12
# Cloud Run/Neon/Firebase で TLS が必要 → distroless なら CA 同梱済み
WORKDIR /app
COPY --from=build /out/app /app/app

USER nonroot:nonroot
ENV PORT=8080

ENTRYPOINT ["/app/app"]