/**
 * Credential Issuer Component
 * 
 * Interface for universities to issue academic credentials.
 */
const credentialIssuerComponent = {
    courses: [],

    render() {
        return `
            <div class="page-container">
                <header class="page-header">
                    <button class="btn-back" onclick="navigateTo('dashboard')">← Back</button>
                    <h1>Issue Academic Credential</h1>
                </header>

                <div class="page-content">
                    <div class="card">
                        <h2>University Portal</h2>
                        <p class="text-muted">Issue verifiable academic credentials to students</p>

                        <form id="issue-credential-form" class="form-vertical">
                            <!-- Student Information -->
                            <div class="form-section">
                                <h3>Student Information</h3>
                                
                                <div class="form-group">
                                    <label for="student-did">Student DID *</label>
                                    <input type="text" id="student-did" placeholder="did:key:..." required />
                                    <small>The decentralized identifier of the student</small>
                                </div>

                                <div class="form-group">
                                    <label for="student-name">Student Name *</label>
                                    <input type="text" id="student-name" placeholder="John Doe" required />
                                </div>
                            </div>

                            <!-- Academic Information -->
                            <div class="form-section">
                                <h3>Academic Information</h3>
                                
                                <div class="form-group">
                                    <label for="institution">Institution *</label>
                                    <input type="text" id="institution" placeholder="University Name" required />
                                </div>

                                <div class="form-group">
                                    <label for="degree">Degree Program *</label>
                                    <input type="text" id="degree" placeholder="Bachelor of Science in Computer Science" required />
                                </div>
                            </div>

                            <!-- Courses -->
                            <div class="form-section">
                                <div class="section-header">
                                    <h3>Courses</h3>
                                    <button type="button" class="btn btn-secondary btn-small" onclick="credentialIssuerComponent.addCourse()">
                                        + Add Course
                                    </button>
                                </div>

                                <div id="courses-container">
                                    <!-- Courses added dynamically -->
                                </div>
                            </div>

                            <div class="button-group">
                                <button type="button" class="btn btn-secondary" onclick="navigateTo('dashboard')">
                                    Cancel
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    Issue Credential
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this.courses = [];
        // Add one course by default
        this.addCourse();
    },

    addCourse() {
        const courseId = Date.now();
        this.courses.push({ id: courseId });

        const container = document.getElementById('courses-container');
        if (!container) return;

        const courseHTML = `
            <div class="course-item" id="course-${courseId}">
                <div class="course-fields">
                    <div class="form-group">
                        <label>Course Name *</label>
                        <input type="text" class="course-name" placeholder="e.g., Blockchain Technology" required />
                    </div>
                    <div class="form-group">
                        <label>Grade *</label>
                        <select class="course-grade" required>
                            <option value="">Select grade</option>
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Credits *</label>
                        <input type="number" class="course-credits" placeholder="3" min="1" max="6" step="0.5" required />
                    </div>
                    <div class="form-group">
                        <label>Year *</label>
                        <input type="number" class="course-year" placeholder="2024" min="2020" max="2030" required />
                    </div>
                </div>
                <button type="button" class="btn-icon-danger" onclick="credentialIssuerComponent.removeCourse(${courseId})" title="Remove course">
                    🗑️
                </button>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', courseHTML);
    },

    removeCourse(courseId) {
        const courseElement = document.getElementById(`course-${courseId}`);
        if (courseElement) {
            courseElement.remove();
        }
        this.courses = this.courses.filter(c => c.id !== courseId);
    },

    async handleIssueCredential(event) {
        event.preventDefault();

        try {
            // Collect form data
            const studentDID = document.getElementById('student-did').value;
            const studentName = document.getElementById('student-name').value;
            const institution = document.getElementById('institution').value;
            const degree = document.getElementById('degree').value;

            // Collect courses
            const coursesData = [];
            const courseItems = document.querySelectorAll('.course-item');

            courseItems.forEach(item => {
                const courseName = item.querySelector('.course-name').value;
                const grade = item.querySelector('.course-grade').value;
                const credits = item.querySelector('.course-credits').value;
                const year = item.querySelector('.course-year').value;

                if (courseName && grade && credits && year) {
                    coursesData.push({
                        courseName,
                        grade,
                        credits: parseFloat(credits),
                        year: parseInt(year)
                    });
                }
            });

            if (coursesData.length === 0) {
                window.app.showError('Please add at least one course');
                return;
            }

            window.app.showLoading();

            // Issue credential
            const credential = await window.credentialManager.issueCredential({
                studentDID,
                studentName,
                institution,
                degree,
                courses: coursesData
            });

            window.app.hideLoading();
            window.app.showSuccess('Credential issued successfully!');

            // Reset form
            event.target.reset();
            this.courses = [];
            document.getElementById('courses-container').innerHTML = '';
            this.addCourse();

        } catch (error) {
            window.app.hideLoading();
            window.app.showError('Failed to issue credential: ' + error.message);
        }
    }
};

// Event delegation for form submission
document.addEventListener('submit', (e) => {
    if (e.target.id === 'issue-credential-form') {
        credentialIssuerComponent.handleIssueCredential(e);
    }
});

window.credentialIssuerComponent = credentialIssuerComponent;
