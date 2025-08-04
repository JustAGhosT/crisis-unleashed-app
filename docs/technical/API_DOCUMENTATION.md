# Crisis Unleashed API Documentation

## Overview

Crisis Unleashed uses a RESTful API built with FastAPI to handle game actions, user management, and blockchain interactions. This documentation provides details on all available endpoints, authentication mechanisms, and data models.

## Base URL

All API endpoints are prefixed with `/api`.

```
https://[domain]/api
```

## Current API Status

The backend is currently in early development with basic endpoints implemented. The core functionality focuses on status checks and will expand to include:

- Game state management
- Player authentication
- Card and deck operations
- Faction-specific mechanics
- Blockchain integration for NFTs

## Available Endpoints

### Health Check

#### Get API Status

```http
GET /api
```

**Response**

```json
{
  "message": "Hello World"
}
```

Status: 200 OK

### Status Checks

#### Create Status Check

```http
POST /api/status
```

Used by clients to register their connection status with the server.

**Request Body**

```json
{
  "client_name": "web-client-1"
}
```

| Parameter   | Type   | Description                          |
| ----------- | ------ | ------------------------------------ |
| client_name | string | Identifier for the connecting client |

**Response**

```json
{
  "_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "client_name": "web-client-1",
  "timestamp": "2024-12-19T10:00:00Z"
}
```

Status: 201 Created

#### Get Status Checks

```http
GET /api/status
```

Retrieve recent status checks.

**Query Parameters**

| Parameter | Type    | Default | Description                                        |
| --------- | ------- | ------- | -------------------------------------------------- |
| limit     | integer | 100     | Maximum number of status checks to return (1-1000) |

**Response**

```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "client_name": "web-client-1",
    "timestamp": "2024-12-19T10:00:00Z"
  },
  {
    "id": "a47bc10b-58cc-4372-a567-0e02b2c3d123",
    "client_name": "web-client-2",
    "timestamp": "2024-12-19T09:55:00Z"
  }
]
```

Status: 200 OK

## Planned Endpoints

The following endpoints are planned for future implementation:

### Authentication

```http
POST /api/auth/register    # Register a new user
POST /api/auth/login       # User login
POST /api/auth/refresh     # Refresh authentication token
GET  /api/auth/me          # Get current user info
```

### Game Management

```http
GET    /api/games                # List available games
POST   /api/games                # Create new game
GET    /api/games/{game_id}      # Get game state
DELETE /api/games/{game_id}      # Delete/forfeit game
```

### Game Actions

```http
POST   /api/games/{game_id}/actions/play_card   # Play a card
POST   /api/games/{game_id}/actions/attack      # Attack with a unit
POST   /api/games/{game_id}/actions/ability     # Use an ability
POST   /api/games/{game_id}/actions/end_turn    # End current turn
```

### Cards & Decks

```http
GET    /api/cards                # List user's cards
GET    /api/cards/{card_id}      # Get card details
GET    /api/decks                # List user's decks
POST   /api/decks                # Create a new deck
GET    /api/decks/{deck_id}      # Get deck details
PUT    /api/decks/{deck_id}      # Update a deck
DELETE /api/decks/{deck_id}      # Delete a deck
```

### Blockchain Integration

```http
GET    /api/blockchain/nfts               # Get user's NFT cards
POST   /api/blockchain/mint               # Mint card as NFT
POST   /api/blockchain/transfer           # Transfer NFT to another user
GET    /api/blockchain/transactions       # Get transaction history
```

## Data Models

### StatusCheck

| Field       | Type          | Description                        |
| ----------- | ------------- | ---------------------------------- |
| id          | string (UUID) | Unique identifier                  |
| client_name | string        | Name of client making the request  |
| timestamp   | datetime      | When the status check was recorded |

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request contains invalid parameters",
    "details": {
      "field": "client_name",
      "reason": "client_name is required"
    }
  }
}
```

Common error codes:

| Code                    | Description                          |
| ----------------------- | ------------------------------------ |
| invalid_request         | Request parameters are invalid       |
| authentication_required | No valid authentication provided     |
| resource_not_found      | The requested resource doesn't exist |




























