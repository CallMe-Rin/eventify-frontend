import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, //defaults to true
  },
});
