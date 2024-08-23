//
// import request from 'supertest';
// import app from '../src/index'; // Your Express app
// import { PrismaClient } from '../prisma';
// import { createData, deleteAllData } from '../scripts/insertData';
//
// const prisma = new PrismaClient();
//
// describe('Google OAuth Login Flow', () => {
//   beforeEach(async () => {
//     await deleteAllData(prisma);
//     await createData(prisma);
//   });
//
//   afterAll(async () => {
//     await prisma.$disconnect();
//   });
//
//   it('should redirect to Google login page', async () => {
//     const res = await request(app)
//       .get('/auth/google')
//       .expect(302);
//
//     expect(res.headers.location).toMatch(/accounts\.google\.com/);
//   });
//
//   it('should handle Google OAuth callback and log in the user', async () => {
//     // Step 1: Redirect user to Google's OAuth 2.0 server (manually performed)
//     // Visit the URL in the test output and complete the login process in your browser.
//     const authUrl = '/auth/google';
//     console.log(`Go to this URL to authenticate: http://localhost:80${authUrl}`);
//
//     // Manually retrieve the authorization code from the redirected URL
//     const code = 'AUTHORIZATION_CODE_FROM_GOOGLE';
//
//     // Step 2: Simulate the callback with the authorization code
//     const res = await request(app)
//       .get(`/auth/google/callback?code=${code}`)
//       .expect(200);
//
//     expect(res.body).toHaveProperty('token');
//     expect(res.body.user.email).toBe('your_email@example.com');
//   });
// });
