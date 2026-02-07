import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, //defaults to true
  },
});
