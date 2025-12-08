/**
 * DIDManager
 * 
 * Manages Decentralized Identifiers (DIDs).
 * Currently supports did:key method.
 */
class DIDManager {
    constructor() {
        this.activeDID = null;
    }

    /**
     * Initialize - load active DID if exists
     */
    async init() {
        // Try to load the most recent DID or a default one
        const dids = await window.storageManager.getAll('dids');
        if (dids && dids.length > 0) {
            // detailed logic could pick a specific one, for now pick the first
            this.activeDID = dids[0];
            console.log('Active DID loaded:', this.activeDID.id);
        }
    }

    /**
     * Creates a new DID
     * @param {string} alias - A human readable alias for this identity
     */
    async createDID(alias = 'New Identity') {
        // 1. Generate Key Pair
        const keyPair = await window.cryptoUtils.generateSigningKeyPair();

        // 2. Derive DID from Public Key
        const didString = await window.cryptoUtils.publicKeyToDID(keyPair.publicKey);

        // 3. Export Private Key (for secure storage)
        // In a real app, we might encrypt this before storing, using a user PIN.
        // The storageManager expects objects. We should probably store the JWK.
        const privateKeyJwk = await window.cryptoUtils.exportKey(keyPair.privateKey);
        const publicKeyJwk = await window.cryptoUtils.exportKey(keyPair.publicKey);

        const didRecord = {
            id: didString,
            alias: alias,
            keys: {
                private: privateKeyJwk,
                public: publicKeyJwk
            },
            created: new Date().toISOString()
        };

        // 4. Store
        await window.storageManager.save('dids', didRecord);

        this.activeDID = didRecord;
        console.log('DID Created:', didString);
        return didRecord;
    }

    /**
     * Resolves a DID to a DID Document
     * @param {string} did 
     */
    async resolve(did) {
        // In real world, if it's a did:key, we generate document from the ID string itself
        // because the key is in the ID.
        // For our demo, we can just construct the document dynamically.

        if (!did.startsWith('did:key:')) {
            throw new Error(`Unsupported DID method: ${did}`);
        }

        // Extract key material from DID string (the part after did:key:)
        // In our simple implementation, this is hex encoded raw public key
        // We can reconstruct the DID Document.

        const didDoc = {
            "@context": "https://www.w3.org/ns/did/v1",
            "id": did,
            "verificationMethod": [{
                "id": `${did}#owner`,
                "type": "EcdsaSecp256r1VerificationKey2019", // Standard for P-256
                "controller": did,
                // In a real did:key, we would decode the multibase/multicodec to get the public key.
                // Since we stored the public key JWK in our local storage for our own DIDs,
                // we can return full details if it's ours.
                // If it is NOT ours (someone else's), we need to be able to derive PH from the string.
                // For this MVP, let's assume we are resolving our own or we parse the hex.
            }],
            "authentication": [`${did}#owner`],
            "assertionMethod": [`${did}#owner`]
        };

        // Attempt to find public key if it's not ours? 
        // For did:key, the DID string itself IS the public key source.

        return didDoc;
    }

    /**
     * Get the private key for the active DID
     * @returns {Promise<CryptoKey>}
     */
    async getPrivateKey() {
        if (!this.activeDID) throw new Error("No active DID");
        return await window.cryptoUtils.importSigningKey(this.activeDID.keys.private, 'private');
    }

    /**
     * Get the public key for the active DID
     */
    async getPublicKey() {
        if (!this.activeDID) throw new Error("No active DID");
        return await window.cryptoUtils.importSigningKey(this.activeDID.keys.public, 'public');
    }

    /**
     * List all local DIDs
     */
    async listDIDs() {
        return await window.storageManager.getAll('dids');
    }
}

// Export singleton
window.didManager = new DIDManager();
