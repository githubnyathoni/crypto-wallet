# Crypto Dashboard Backend

This is the backend service for the Crypto Dashboard application using clean architecture. It provides RESTful APIs for managing user wallets, transactions, and balances. The backend is built using [NestJS](https://nestjs.com/) and [Prisma ORM](https://www.prisma.io/), and connects to a PostgreSQL database.

## Table of Contents

- [Features](#features)
- [Entity Relationship Diagram](#erd)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Seeding the Database](#seeding-the-database)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Demo](#demo)

## Features

- **User Management:** Create and manage users with JWT-based authentication.
- **Crypto Wallet Management:** Manage wallets, balances, and transactions.
- **Balance Top-up and Transfer:** Top-up crypto wallet and transfer balances between users.
- **Transaction History:** View transaction history with filtering, sorting, and pagination.
- **Top Users and Transactions:** View top users and transactions based on various metrics.
- **Audit Logs:** Track balance changes in a transaction history (debit/credit).
- **Clean Architecture:** Organized codebase with clean separation between business logic and infrastructure.

## Entity Relationship Diagram

![Entity Relationship Diagram Crypto Wallet](https://i.imgur.com/N9UiTwO.png)

## Technologies

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/) for authentication
- [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (local or hosted)

## Getting Started

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/githubnyathoni/crypto-wallet.git
   cd crypto-wallet
   ```
2. Install dependencies
   ```bash
   npm install
   ```

### Environment Variables

Set up environment variables by creating a .env file (use .env.example as a reference):

```bash
cp .env.example .env
```

### Database Setup

1. Initialize the Prisma schema and run migrations:
   ```bash
   cp .env.example .env
   ```
2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

### Seeding the Database

To populate the database with initial data, run the seeding command:

```bash
npx prisma db seed
```

### Running the Application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### API Documentation

The API provides the following key endpoints:

- Auth: `/v1/api/auth/login`, `/v1/api/auth/register`
- Wallet: `/v1/api/wallet/topup`, `/v1/api/wallet/transfer`
- Transactions: `/v1/api/transaction/top_users`, `/v1/api/transaction/top_transactions`, `/v1/api/transaction/list`

Refer to the detailed API documentation available at [API Docs](http://108.174.48.153:3000/v1/docs).

### Testing

```bash
# unit test
$ npm run test
# end to end test
$ npm run test:e2e
```

### Demo

Live Demo: http://108.174.48.153:3000/
