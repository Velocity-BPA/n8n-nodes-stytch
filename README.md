# n8n-nodes-stytch

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Stytch** - the modern passwordless authentication platform. This node enables workflow automation for user management, magic links, OTPs, sessions, OAuth, TOTP, WebAuthn (passkeys), passwords, crypto wallets, and B2B organization management.

![n8n](https://img.shields.io/badge/n8n-community_node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **12 Resource Categories** with 60+ operations
- **Consumer Authentication** (B2C) - Magic Links, OTP, OAuth, Passwords, TOTP, WebAuthn, Crypto Wallets
- **B2B Authentication** - Organization management, Member management, SSO (SAML/OIDC)
- **Session Management** - Create, authenticate, revoke sessions
- **Webhook Trigger** - Listen for Stytch events with HMAC signature verification
- **Environment Switching** - Easy toggle between test and live environments
- **Rate Limit Handling** - Automatic retry with exponential backoff
- **Cursor-Based Pagination** - Efficient retrieval of large datasets

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-stytch`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Clone or download this repository
git clone https://github.com/Velocity-BPA/n8n-nodes-stytch.git
cd n8n-nodes-stytch

# Install dependencies and build
npm install
npm run build

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-stytch.git
cd n8n-nodes-stytch

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-stytch

# Restart n8n
n8n start
```

## Credentials Setup

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Project ID | String | Yes | Your Stytch project ID |
| Secret | Password | Yes | Your Stytch project secret |
| Environment | Options | Yes | `test` or `live` |
| Product Type | Options | Yes | `consumer` or `b2b` |

To get your credentials:
1. Log in to your [Stytch Dashboard](https://stytch.com/dashboard)
2. Navigate to **API Keys**
3. Copy your Project ID and Secret
4. Use `test` environment for development

## Resources & Operations

### User (Consumer)

| Operation | Description |
|-----------|-------------|
| Create | Create a new user |
| Get | Get user by ID |
| Get by Email | Search user by email |
| Get by Phone | Search user by phone |
| Get All | List all users |
| Update | Update user properties |
| Delete | Permanently delete user |
| Delete Email | Remove email from user |
| Delete Phone | Remove phone from user |
| Delete WebAuthn | Remove WebAuthn registration |
| Delete TOTP | Remove TOTP registration |
| Delete Crypto Wallet | Remove crypto wallet |
| Delete Password | Remove password |
| Delete Biometric | Remove biometric registration |
| Delete OAuth | Remove OAuth connection |

### Magic Link

| Operation | Description |
|-----------|-------------|
| Send by Email | Send magic link via email |
| Send by Email Embedded | Create embeddable magic link |
| Authenticate | Authenticate magic link token |
| Create Embedded | Create embeddable token |

### OTP (One-Time Passcode)

| Operation | Description |
|-----------|-------------|
| Send by SMS | Send OTP via SMS |
| Send by WhatsApp | Send OTP via WhatsApp |
| Send by Email | Send OTP via email |
| Authenticate | Verify OTP code |
| Login or Create | Send OTP, create user if needed |

### Session

| Operation | Description |
|-----------|-------------|
| Get | Get session by ID |
| Get All | List sessions for a user |
| Authenticate | Authenticate session token |
| Authenticate JWT | Authenticate session JWT |
| Revoke | Revoke specific session |
| Get JWKS | Get JSON Web Key Set |
| Exchange | Exchange session for different token |

### OAuth

| Operation | Description |
|-----------|-------------|
| Authenticate | Authenticate OAuth token |
| Get Providers | List available OAuth providers |
| Attach | Attach OAuth to existing user |

**Supported Providers:** Amazon, Apple, Bitbucket, Coinbase, Discord, Facebook, Figma, GitHub, GitLab, Google, HubSpot, LinkedIn, Microsoft, Salesforce, Slack, Snapchat, Spotify, Steam, TikTok, Twitch, Twitter, Yahoo

### TOTP (Authenticator App)

| Operation | Description |
|-----------|-------------|
| Create | Create TOTP registration |
| Authenticate | Verify TOTP code |
| Get Recovery Codes | Get recovery codes |
| Recover | Authenticate with recovery code |

### WebAuthn (Passkeys)

| Operation | Description |
|-----------|-------------|
| Register Start | Start passkey registration |
| Register Complete | Complete passkey registration |
| Authenticate Start | Start passkey authentication |
| Authenticate Complete | Complete passkey authentication |
| Update | Update passkey name |

### Password

| Operation | Description |
|-----------|-------------|
| Create | Set password for user |
| Authenticate | Authenticate with password |
| Strength Check | Check password strength |
| Migrate | Migrate existing password hash |
| Reset by Email Start | Start password reset flow |
| Reset by Email | Complete password reset |
| Reset by Existing Password | Change password |
| Reset by Session | Reset via active session |

### Crypto Wallet

| Operation | Description |
|-----------|-------------|
| Authenticate Start | Start wallet authentication |
| Authenticate | Complete wallet authentication |

### B2B Organization

| Operation | Description |
|-----------|-------------|
| Create | Create organization |
| Get | Get organization by ID |
| Get All | Search organizations |
| Update | Update organization settings |
| Delete | Remove organization |

### B2B Member

| Operation | Description |
|-----------|-------------|
| Create | Create organization member |
| Get | Get member by ID |
| Get All | Search members |
| Update | Update member properties |
| Delete | Remove member |
| Reactivate | Reactivate deleted member |
| Delete Email | Remove email from member |
| Delete Phone | Remove phone from member |
| Delete TOTP | Remove TOTP registration |
| Delete Password | Remove password |

### B2B SSO

| Operation | Description |
|-----------|-------------|
| Get Connections | List SSO connections |
| Delete Connection | Remove SSO connection |
| Authenticate SAML | Authenticate SAML response |
| Authenticate OIDC | Authenticate OIDC token |

## Trigger Node

The **Stytch Trigger** node listens for webhook events from Stytch.

### Supported Events

**User Events:**
- `user.created`
- `user.updated`
- `user.deleted`

**Session Events:**
- `session.created`
- `session.authenticated`
- `session.revoked`

**Member Events (B2B):**
- `member.created`
- `member.updated`
- `member.deleted`

**Organization Events (B2B):**
- `organization.created`
- `organization.updated`
- `organization.deleted`

**Authentication Success Events:**
- `magic_link.authenticate.success`
- `otp.authenticate.success`
- `oauth.authenticate.success`
- `password.authenticate.success`
- `totp.authenticate.success`
- `webauthn.authenticate.success`

### Webhook Setup

1. Deploy your n8n workflow with the Stytch Trigger node
2. Copy the webhook URL displayed in the node
3. Go to your [Stytch Dashboard](https://stytch.com/dashboard/webhooks)
4. Add a new webhook with your n8n webhook URL
5. Select the events you want to receive
6. Copy the webhook signing secret and add it to the trigger node

### Signature Verification

The trigger node supports HMAC signature verification:

| Option | Default | Description |
|--------|---------|-------------|
| Verify Signature | true | Enable/disable signature verification |
| Signature Header Name | x-stytch-signature | Header containing the signature |
| Timestamp Header Name | x-stytch-signature-timestamp | Header containing the timestamp |
| Max Timestamp Age | 300 | Maximum age of timestamp in seconds |

## Usage Examples

### Create a User and Send Magic Link

```json
{
  "nodes": [
    {
      "name": "Stytch",
      "type": "n8n-nodes-stytch.stytch",
      "parameters": {
        "resource": "user",
        "operation": "create",
        "email": "user@example.com"
      }
    },
    {
      "name": "Send Magic Link",
      "type": "n8n-nodes-stytch.stytch",
      "parameters": {
        "resource": "magicLink",
        "operation": "sendByEmail",
        "email": "={{ $json.user.emails[0].email }}"
      }
    }
  ]
}
```

### Authenticate OTP and Create Session

```json
{
  "nodes": [
    {
      "name": "Verify OTP",
      "type": "n8n-nodes-stytch.stytch",
      "parameters": {
        "resource": "otp",
        "operation": "authenticate",
        "methodId": "phone-number-test-xxx",
        "code": "123456",
        "options": {
          "sessionDurationMinutes": 60
        }
      }
    }
  ]
}
```

## Stytch Concepts

### Session Duration

Sessions can be configured with durations from 5 minutes to 527,040 minutes (1 year). Shorter sessions are more secure but require more frequent re-authentication.

### User Metadata

- **Trusted Metadata**: Server-side only, can store sensitive information
- **Untrusted Metadata**: Client-writable, use for non-sensitive data

### Phone Numbers

All phone numbers must be in E.164 format (e.g., `+12025551234`). The node automatically formats numbers when possible.

### B2B vs Consumer

- **Consumer (B2C)**: Individual user authentication
- **B2B**: Organization-based authentication with members and SSO

## Error Handling

The node handles Stytch-specific errors:

| Error Type | Description |
|------------|-------------|
| invalid_email | Invalid email format |
| invalid_phone_number | Invalid phone format |
| user_not_found | User doesn't exist |
| magic_link_not_found | Magic link expired/invalid |
| otp_code_not_found | OTP invalid/expired |
| session_not_found | Session doesn't exist |
| too_many_requests | Rate limit exceeded |

## Security Best Practices

1. **Use Test Environment for Development**: Always use the test environment during development
2. **Rotate Secrets Regularly**: Regularly rotate your API secrets
3. **Verify Webhook Signatures**: Always enable signature verification for webhooks
4. **Short Session Durations**: Use shorter session durations when possible
5. **Use Trusted Metadata**: Store sensitive data in trusted metadata only

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-stytch/issues)
- **Documentation**: [Stytch Docs](https://stytch.com/docs)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Stytch](https://stytch.com) for their excellent authentication platform
- [n8n](https://n8n.io) for the workflow automation platform
- The n8n community for inspiration and support
