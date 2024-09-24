// Google Strategy
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { generateToken } from "./authJwt";
import { PrismaClient } from "../prisma";

const prisma = new PrismaClient();

export enum AuthTypes {
  google = "google",
  offers = "email",
}
// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("here");
        console.log(profile);
        //   // Check if user already exists
        if (!profile.emails?.length) {
          return done(Error("no email found"), false);
        }
        const email = profile?.emails[0].value;
        const firstName = profile.name!.givenName;
        const lastName = profile.name!.familyName;
        const accessTokenValue = accessToken;
        // if (email) {
        //   return done(Error('no email found'), false);
        // }
        let user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        let token;
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              firstName,
              lastName,
              authStrategy: AuthTypes.google,
            },
          });
        }
        token = generateToken({ id: user.id + "", email: user.email });

        user = await prisma.user.update({
          where: { email: email },
          data: {
            authStrategy: AuthTypes.google,
          },
        });

        //
        //   // If user does not exist, create a new user
        console.log({
          email,
          password: "ignore", // Set password to something secure if needed, or use a different field for OAuth users
          firstName,
          lastName,
          authId: token,
        });
        //
        //   // Generate JWT without expiration

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
