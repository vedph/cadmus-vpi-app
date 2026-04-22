# Cadmus VPI App

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

- [backend](https://github.com/vedph/cadmus-vpi-api)
- non-generic models:
  - [books](https://github.com/vedph/cadmus-ndp-books)
  - [codicology](https://github.com/vedph/cadmus-codicology)
  - [codicological formulas](https://github.com/vedph/cod-layout-view)

## Docker

🐋 Quick Docker image build:

1. update version in `env.js` and `ng build --configuration=production`
2. `docker build . -t vedph2020/cadmus-vpi-app:0.0.1 -t vedph2020/cadmus-vpi-app:latest` (replace with the current version).

## History

### 0.0.1

- 2026-04-22: Docker image.
- 2026-04-21: updated Angular and packages.
- 2026-04-10: initial commit.
