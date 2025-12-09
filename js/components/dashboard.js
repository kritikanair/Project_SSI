/**
 * Dashboard Component
 * 
 * Main dashboard showing user's identity and credentials.
 */
const dashboardComponent = {
    render() {
        return `
            <div class="dashboard-container">
                <header class="dashboard-header">
                    <h1>SSI Wallet</h1>
                    <div class="header-actions">
                        <button class="btn-icon" onclick="window.app.refresh()" title="Refresh">
                            🔄
                        </button>
                    </div>
                </header>

                <div class="dashboard-content">
                    <!-- Identity Card -->
                    <div id="identity-card" class="card">
                        <!-- Populated by init() -->
                    </div>

                    <!-- Role Selector -->
                    <div class="role-selector">
                        <h2>What would you like to do?</h2>
                        <div class="role-cards">
                            <div class="role-card" onclick="navigateTo('issuer')">
                                <div class="role-icon">🎓</div>
                                <h3>Issue Credentials</h3>
                                <p>Act as a university to issue academic credentials</p>
                            </div>
                            <div class="role-card" onclick="navigateTo('holder')">
                                <div class="role-icon">👤</div>
                                <h3>My Credentials</h3>
                                <p>View and share your credentials selectively</p>
                            </div>
                            <div class="role-card" onclick="navigateTo('verifier')">
                                <div class="role-icon">✓</div>
                                <h3>Verify Credentials</h3>
                                <p>Check the validity of shared credentials</p>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div id="recent-activity" class="card">
                        <h2>Recent Activity</h2>
                        <div id="activity-list">
                            <!-- Populated by init() -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        await this.renderIdentityCard();
        await this.renderRecentActivity();
    },

    async renderIdentityCard() {
        const card = document.getElementById('identity-card');
        if (!card) return;

        const did = window.didManager.activeDID;
        if (!did) {
            card.innerHTML = '<p>No active identity</p>';
            return;
        }

        const credentials = await window.credentialManager.getMyCredentials();

        card.innerHTML = `
            <div class="identity-header">
                <div class="avatar">👤</div>
                <div class="identity-info">
                    <h2>${did.alias || 'My Identity'}</h2>
                    <div class="did-display">
                        <code class="did-code-short">${this.shortenDID(did.id)}</code>
                        <button class="btn-icon-small" onclick="navigator.clipboard.writeText('${did.id}'); window.app.showSuccess('DID copied!')">
                            📋
                        </button>
                    </div>
                </div>
            </div>
            <div class="identity-stats">
                <div class="stat">
                    <span class="stat-value">${credentials.length}</span>
                    <span class="stat-label">Credentials</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${did.created ? new Date(did.created).toLocaleDateString() : 'N/A'}</span>
                    <span class="stat-label">Created</span>
                </div>
            </div>
        `;
    },

    async renderRecentActivity() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;

        const credentials = await window.credentialManager.getMyCredentials();

        if (credentials.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <p>No activity yet</p>
                    <p class="text-muted">Issue or receive credentials to get started</p>
                </div>
            `;
            return;
        }

        const activities = credentials
            .slice(0, 5)
            .map(cred => {
                const isIssued = cred.issuer === window.didManager.activeDID?.id;
                return `
                    <div class="activity-item">
                        <span class="activity-icon">${isIssued ? '📤' : '📥'}</span>
                        <div class="activity-details">
                            <p class="activity-title">${isIssued ? 'Issued' : 'Received'} credential</p>
                            <p class="activity-meta">${new Date(cred.issuanceDate).toLocaleString()}</p>
                        </div>
                    </div>
                `;
            })
            .join('');

        activityList.innerHTML = activities;
    },

    shortenDID(did) {
        if (!did || did.length < 20) return did;
        return `${did.substring(0, 15)}...${did.substring(did.length - 10)}`;
    }
};

window.dashboardComponent = dashboardComponent;
