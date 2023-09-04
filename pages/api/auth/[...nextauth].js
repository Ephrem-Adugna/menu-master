import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
        clientId: '601636314509-o7fqlg3h319dblgilis0j578aibg3vo9.apps.googleusercontent.com',
        clientSecret: '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',
       
      })
  ],
  pages:{
    signin:'/login'
  }
};

export default NextAuth(authOptions);