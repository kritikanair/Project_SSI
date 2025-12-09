/**
 * Credential Holder Component
 * 
 * Interface for students to view and share their credentials selectively.
 */
const credentialHolderComponent = {
    selectedCredential: null,

    render() {
        return `
            <div class="page-container">
                <header class="page-header">
                    <button class="btn-back" onclick="navigateTo('dashboard')">← Back</button>
                    <h1>My Credentials</h1>
                </header>

                <div class="page-content">
                    <div id="credentials-list" class="credentials-grid">
                        <!-- Populated by init() -->
                    </div>

                    <!-- Credential Detail Modal -->
                    <div id="credential-modal" class="modal hidden">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2>Credential Details</h2>
                                <button class="btn-close" onclick="credentialHolderComponent.closeModal()">×</button>
                            </div>
                            <div id="credential-details" class="modal-body">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        await this.renderCredentials();
    },

    async renderCredentials() {
        const container = document.getElementById('credentials-list');
        if (!container) return;

        const credentials = await window.credentialManager.getMyCredentials();

        if (credentials.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon-large">📄</div>
                    <h2>No Credentials Yet</h2>
                    <p>You haven't received any credentials yet.</p>
                    <button class="btn btn-primary" onclick="navigateTo('issuer')">
                        Issue Your First Credential
                    </button>
                </div>
            `;
            return;
        }

        const html = credentials.map(cred => {
            const isReceived = cred.credentialSubject.id === window.didManager.activeDID?.id;
            const type = isReceived ? 'Received' : 'Issued';
            const gpa = cred.credentialSubject.gpa || 'N/A';
            const coursesCount = cred.credentialSubject.courses?.length || 0;

            return `
                <div class="credential-card" onclick="credentialHolderComponent.viewCredential('${cred.id}')">
                    <div class="credential-header">
                        <span class="badge badge-${isReceived ? 'success' : 'info'}">${type}</span>
                        <span class="credential-date">${new Date(cred.issuanceDate).toLocaleDateString()}</span>
                    </div>
                    <h3>${cred.credentialSubject.name || 'Unknown'}</h3>
                    <p class="text-muted">${cred.credentialSubject.degree || 'Credential'}</p>
                    <p class="text-muted">${cred.credentialSubject.institution || ''}</p>
                    <div class="credential-stats">
                        <div class="stat-small">
                            <span class="stat-label">GPA</span>
                            <span class="stat-value">${gpa}</span>
                        </div>
                        <div class="stat-small">
                            <span class="stat-label">Courses</span>
                            <span class="stat-value">${coursesCount}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    },

    async viewCredential(credentialId) {
        this.selectedCredential = window.credentialManager.getCredential(credentialId);
        if (!this.selectedCredential) return;

        const modal = document.getElementById('credential-modal');
        const details = document.getElementById('credential-details');

        if (!modal || !details) return;

        const subject = this.selectedCredential.credentialSubject;
        const courses = subject.courses || [];

        const coursesHTML = courses.map(course => `
            <tr>
                <td>${course.courseName}</td>
                <td>${course.grade}</td>
                <td>${course.credits}</td>
                <td>${course.year}</td>
            </tr>
        `).join('');

        details.innerHTML = `
            <div class="credential-detail-section">
                <h3>Student Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Name</label>
                        <p>${subject.name}</p>
                    </div>
                    <div class="detail-item">
                        <label>DID</label>
                        <code class="did-code-small">${subject.id}</code>
                    </div>
                </div>
            </div>

            <div class="credential-detail-section">
                <h3>Academic Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Institution</label>
                        <p>${subject.institution}</p>
                    </div>
                    <div class="detail-item">
                        <label>Degree</label>
                        <p>${subject.degree}</p>
                    </div>
                    <div class="detail-item">
                        <label>GPA</label>
                        <p><strong>${subject.gpa}</strong></p>
                    </div>
                </div>
            </div>

            <div class="credential-detail-section">
                <h3>Courses</h3>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Grade</th>
                            <th>Credits</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${coursesHTML}
                    </tbody>
                </table>
            </div>

            <div class="credential-detail-section">
                <h3>Selective Disclosure</h3>
                <p class="text-muted">Choose which attributes to share</p>
                
                <div class="attribute-selector">
                    <label class="checkbox-label">
                        <input type="checkbox" class="attr-checkbox" value="name" checked />
                        Name
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" class="attr-checkbox" value="institution" checked />
                        Institution
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" class="attr-checkbox" value="degree" checked />
                        Degree
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" class="attr-checkbox" value="courses" />
                        Courses (detailed)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" class="attr-checkbox" value="gpa" />
                        GPA
                    </label>
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="credentialHolderComponent.closeModal()">
                    Close
                </button>
                <button class="btn btn-primary" onclick="credentialHolderComponent.shareSelectively()">
                    Create Shareable Presentation
                </button>
            </div>
        `;

        modal.classList.remove('hidden');
    },

    async shareSelectively() {
        if (!this.selectedCredential) return;

        // Get selected attributes
        const checkboxes = document.querySelectorAll('.attr-checkbox:checked');
        const attributesToReveal = Array.from(checkboxes).map(cb => cb.value);

        if (attributesToReveal.length === 0) {
            window.app.showError('Please select at least one attribute to share');
            return;
        }

        try {
            window.app.showLoading();

            // Create selective presentation
            const presentation = await window.selectiveDisclosure.createSelectivePresentation(
                this.selectedCredential,
                attributesToReveal
            );

            // Convert to shareable format
            const shareableData = JSON.stringify(presentation, null, 2);

            window.app.hideLoading();

            // Show shareable presentation
            this.showShareablePresentation(shareableData, attributesToReveal);

        } catch (error) {
            window.app.hideLoading();
            window.app.showError('Failed to create presentation: ' + error.message);
        }
    },

    showShareablePresentation(data, revealed) {
        const details = document.getElementById('credential-details');
        if (!details) return;

        details.innerHTML = `
            <div class="success-message">
                <div class="icon-large success">✓</div>
                <h2>Shareable Presentation Created!</h2>
                <p>The following attributes will be revealed:</p>
                <ul>
                    ${revealed.map(attr => `<li>${attr}</li>`).join('')}
                </ul>
            </div>

            <div class="presentation-data">
                <h3>Presentation Data</h3>
                <textarea readonly class="presentation-textarea">${data}</textarea>
                <button class="btn btn-secondary btn-block" onclick="navigator.clipboard.writeText(\`${data.replace(/`/g, '\\`')}\`); window.app.showSuccess('Copied to clipboard!')">
                    📋 Copy to Clipboard
                </button>
            </div>

            <div class="info-box">
                <p><strong>How to share:</strong></p>
                <p>1. Copy the presentation data above</p>
                <p>2. Share it with the verifier (employer, institution, etc.)</p>
                <p>3. They can verify it without seeing hidden attributes</p>
            </div>

            <div class="modal-actions">
                <button class="btn btn-primary" onclick="credentialHolderComponent.closeModal()">
                    Done
                </button>
            </div>
        `;
    },

    closeModal() {
        const modal = document.getElementById('credential-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.selectedCredential = null;
    }
};

window.credentialHolderComponent = credentialHolderComponent;
