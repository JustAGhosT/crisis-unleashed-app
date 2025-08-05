# Backend Setup Guide

## Environment Configuration

### 1. Create Environment File

Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Generate Secure Secret Key

**CRITICAL**: You must replace the placeholder secret key before running the application.

#### Option A: Use the provided generator
```bash
python generate_secret_key.py
```

#### Option B: Generate with OpenSSL
```bash
openssl rand -hex 32
```

#### Option C: Generate with Python
```bash
python -c "import secrets; print(f'SECRET_KEY={secrets.token_hex(32)}')"
```

### 3. Update Environment Variables

Edit your `.env` file and replace:
```bash
# Replace this placeholder
SECRET_KEY=__REPLACE_ME_SECURE_RANDOM_HEX__

# With your generated key
SECRET_KEY=your_actual_64_character_hex_string_here
```

### 4. Configure Database

For local development with MongoDB:
```bash
MONGO_URL=mongodb://localhost:27017
DATABASE_NAME=crisis_unleashed_dev
```

For production with MongoDB Atlas:
```bash
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=crisis_unleashed_prod
```

### 5. Configure Blockchain Networks (Optional)

Set up your blockchain RPC endpoints:
```bash
# Ethereum (replace with your Infura project ID)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_infura_project_id

# Etherlink (Tezos L2)
ETHERLINK_RPC_URL=https://node.ghostnet.etherlink.com
```

## Security Checklist

- [ ] ✅ Replaced `SECRET_KEY` placeholder with secure random value
- [ ] ✅ Used strong database credentials (if applicable)
- [ ] ✅ Set `DEBUG=false` for production
- [ ] ✅ Configured proper CORS origins for production
- [ ] ✅ Never committed `.env` file to version control

## Quick Start

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment (see steps above)

3. Start the server:
   ```bash
   uvicorn server:app --reload
   ```

4. Visit: http://localhost:8000/docs

## Production Considerations

### Security

- Use a 64+ character random hex string for `SECRET_KEY`
- Set `DEBUG=false`
- Configure specific CORS origins instead of `*`
- Use HTTPS in production
- Regularly rotate secrets

### Database

- Use connection pooling settings appropriate for your load
- Set up database backup and monitoring
- Consider read replicas for high-traffic scenarios

### Monitoring

- Set up logging aggregation
- Monitor blockchain connection health
- Set up alerts for failed transactions
- Track outbox processing metrics

## Troubleshooting

### Common Issues

**Error: "SECURITY ERROR: Replace the placeholder SECRET_KEY!"**
- Solution: Generate and set a proper secret key (see step 2 above)

**Error: "No module named 'fastapi'"**
- Solution: Install requirements: `pip install -r requirements.txt`

**Error: MongoDB connection failed**
- Solution: Check `MONGO_URL` in your `.env` file
- Ensure MongoDB is running (for local setup)
- Verify credentials and network access (for cloud setup)