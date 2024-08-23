// Google Strategy
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { generateToken } from "./authJwt";
import { PrismaClient } from "../prisma";

const prisma = new PrismaClient();

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("here");
      try {
        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: {
            id: Number(profile.id),
          },
        });

        // If user does not exist, create a new user
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails![0].value,
              password: "ignore", // Set password to something secure if needed, or use a different field for OAuth users
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              authId: profile.id,
            },
          });
        }

        // Generate JWT without expiration
        const token = generateToken({ id: user.id + "", email: user.email });

        done(null, { user, token });
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

// Facebook Strategy
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_CLIENT_ID!,
//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//   callbackURL: '/auth/facebook/callback',
//   profileFields: ['id', 'emails', 'name']
// }, async (accessToken, refreshToken, profile, done) => {
//   const email = profile.emails ? profile.emails[0].value : null;
//
//   if (email) {
//     const user = await prisma.user.upsert({
//       where: { email },
//       update: {},
//       create: {
//         email,
//         name: `${profile.name?.givenName} ${profile.name?.familyName}`,
//         facebookId: profile.id,
//       },
//     });
//
//     const token = generateToken({ id: user.id, email: user.email });
//     done(null, { user, token });
//   } else {
//     done(new Error('No email found'));
//   }
// }));
//
// // Apple Strategy
// passport.use(new AppleStrategy({
//   clientID: process.env.APPLE_CLIENT_ID!,
//   teamID: process.env.APPLE_TEAM_ID!,
//   keyID: process.env.APPLE_KEY_ID!,
//   key: process.env.APPLE_KEY!, // the private key, usually stored as a PEM file
//   callbackURL: '/auth/apple/callback',
// }, async (accessToken, refreshToken, profile, done) => {
//   const user = await prisma.user.upsert({
//     where: { appleId: profile.id },
//     update: {},
//     create: {
//       email: profile.email,
//       name: profile.name,
//       appleId: profile.id,
//     },
//   });
//
//   const token = generateToken({ id: user.id, email: user.email });
//   done(null, { user, token });
// }));
