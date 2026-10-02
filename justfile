ip := `ip route get 1 | awk '{print $7; exit}'`
default_port := "4200"

default: start

build:
  npm run build

start:
  npm run start

start-bind port=default_port:
  ng serve --host {{ip}} --port {{port}}