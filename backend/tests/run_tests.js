const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('--- Starting InternLink API Integration Tests ---');

  let studentToken = '';
  let adminToken = '';
  let testOpportunityId = '';
  let testApplicationId = '';

  const uniqueEmail = `tester-${Date.now()}@internlink.com`;

  try {
    // 1. Test Student Registration
    console.log('1. Testing student registration...');
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: uniqueEmail,
        password: 'password123',
        role: 'student',
      }),
    });
    const registerData = await registerRes.json();
    assert.strictEqual(registerRes.status, 201, `Expected 201, got ${registerRes.status}: ${JSON.stringify(registerData)}`);
    assert.ok(registerData.token, 'Expected JWT token in registration response');
    studentToken = registerData.token;
    console.log('   ✓ Student registered successfully.');

    // 2. Test Student Login
    console.log('2. Testing student login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    assert.strictEqual(loginRes.status, 200, `Expected 200, got ${loginRes.status}`);
    assert.ok(loginData.token, 'Expected JWT token in login response');
    console.log('   ✓ Student logged in successfully.');

    // 3. Test Get Current User
    console.log('3. Testing fetching profile (GET /auth/me)...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const meData = await meRes.json();
    assert.strictEqual(meRes.status, 200, `Expected 200, got ${meRes.status}`);
    assert.strictEqual(meData.email, uniqueEmail, `Expected email to match ${uniqueEmail}`);
    console.log('   ✓ Profile fetched successfully.');

    // 4. Test Update Profile
    console.log('4. Testing updating profile details...');
    const updateRes = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        bio: 'Just a test developer bio',
        skills: 'JavaScript, testing, automation',
        cvUrl: 'http://localhost:5000/uploads/dummy-cv.pdf', // Set dummy cv url so we can apply
      }),
    });
    const updateData = await updateRes.json();
    assert.strictEqual(updateRes.status, 200, `Expected 200, got ${updateRes.status}`);
    assert.strictEqual(updateData.bio, 'Just a test developer bio');
    assert.deepStrictEqual(updateData.skills, ['JavaScript', 'testing', 'automation']);
    console.log('   ✓ Profile updated successfully.');

    // 5. Test Admin Login (for opportunity creation)
    console.log('5. Testing admin login (using seeded account admin@internlink.com)...');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@internlink.com',
        password: 'admin123',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert.strictEqual(adminLoginRes.status, 200, `Seeded admin login failed. Ensure seed.js has been run!`);
    adminToken = adminLoginData.token;
    console.log('   ✓ Admin logged in successfully.');

    // 6. Test Admin Creating Opportunity
    console.log('6. Testing opportunity creation (Admin-only)...');
    const oppRes = await fetch(`${BASE_URL}/opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'QA Automation Engineer',
        company: 'InternLink Testing Lab',
        location: 'Remote',
        type: 'internship',
        stipend: '$5,000/mo',
        duration: '3 months',
        deadline: new Date(Date.now() + 86400000 * 10), // 10 days from now
        description: 'Verify and validate features of the platform.',
        requirements: 'Knowledge of HTTP requests and basic assertions.',
      }),
    });
    const oppData = await oppRes.json();
    assert.strictEqual(oppRes.status, 201, `Expected 201, got ${oppRes.status}`);
    assert.ok(oppData._id, 'Expected returned opportunity to have an ID');
    testOpportunityId = oppData._id;
    console.log('   ✓ Opportunity created successfully.');

    // 7. Test Student Applying
    console.log('7. Testing student applying for the opportunity...');
    const appRes = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        opportunityId: testOpportunityId,
        coverLetter: 'I am excited to help test the InternLink platform!',
      }),
    });
    const appData = await appRes.json();
    assert.strictEqual(appRes.status, 201, `Expected 201, got ${appRes.status}: ${JSON.stringify(appData)}`);
    assert.ok(appData.application._id, 'Expected application to have an ID');
    testApplicationId = appData.application._id;
    console.log('   ✓ Application submitted successfully.');

    // 8. Test Student Retrieving Applications
    console.log('8. Testing student fetching their applications...');
    const getAppsRes = await fetch(`${BASE_URL}/applications/student`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const getAppsData = await getAppsRes.json();
    assert.strictEqual(getAppsRes.status, 200, `Expected 200, got ${getAppsRes.status}`);
    assert.ok(getAppsData.length > 0, 'Expected at least one application returned');
    assert.strictEqual(getAppsData[0].opportunity._id, testOpportunityId);
    console.log('   ✓ Applications list retrieved successfully.');

    // 9. Test Admin Updating Application Status
    console.log('9. Testing admin updating application status to accepted...');
    const statusRes = await fetch(`${BASE_URL}/applications/${testApplicationId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'accepted' }),
    });
    const statusData = await statusRes.json();
    assert.strictEqual(statusRes.status, 200, `Expected 200, got ${statusRes.status}`);
    assert.strictEqual(statusData.application.status, 'accepted');
    console.log('   ✓ Candidate application status updated successfully.');

    console.log('\n=============================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('=============================================\n');
  } catch (error) {
    console.error('\n❌ TEST SUITE ENCOUNTERED A FAILURE:');
    console.error(error);
    process.exit(1);
  }
};

runTests();
