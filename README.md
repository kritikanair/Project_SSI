# Self-Sovereign Identity (SSI) Mobile App

A Progressive Web App for Academic Credential Verification using Decentralized Identifiers (DIDs) and Verifiable Credentials.

## 🎯 Overview

This project implements a Self-Sovereign Identity system that allows students to:
- Create and manage their decentralized digital identities (DIDs)
- Store academic credentials securely
- Share credentials selectively without revealing full transcripts
- Authenticate without passwords using DID-based authentication

## 🔑 Key Features

- **Decentralized Identity**: Create DIDs without relying on centralized authorities
- **Verifiable Credentials**: Academic credentials following W3C standards
- **Selective Disclosure**: Share only necessary information using zero-knowledge proofs
- **Passwordless Authentication**: DID-based challenge-response authentication
- **Privacy-Preserving**: Cryptographic proofs without revealing sensitive data
- **Cross-Platform**: Works on mobile and desktop browsers as a PWA

## 📋 Documentation

See [implementation_plan.md](./implementation_plan.md) for detailed architecture, component design, and implementation strategy.

## 🚀 Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Crypto**: Web Crypto API
- **Storage**: IndexedDB with encryption
- **PWA**: Service Workers for offline support
- **Standards**: W3C DID Core, W3C Verifiable Credentials

## 🏗️ Architecture

The app follows a layered architecture:
- **UI Layer**: PWA with responsive design
- **Identity Layer**: DID management, credential operations, selective disclosure
- **Crypto Layer**: Key management, signatures, hashing
- **Storage Layer**: Encrypted IndexedDB

## 📱 Use Cases

1. **Student**: Create identity, receive credentials, share selectively
2. **University**: Issue academic credentials to students
3. **Employer**: Verify credentials without accessing full transcripts

## 🔐 Security

- Private keys never leave the device
- All credentials encrypted at rest
- Zero-knowledge proofs for selective disclosure
- No central authority or single point of failure

## 📄 License

MIT License

## 👥 Contributing

This is an educational project demonstrating SSI concepts for academic credential verification.
