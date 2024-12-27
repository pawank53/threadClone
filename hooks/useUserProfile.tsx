import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";


export function useUserProfile() {
  const  {user} =useUser();
  const clerkId=user?.id;
  console.log("Usrr Id from use user profile hook>>", user?.id);
  

  const userProfile=useQuery(api.users.getUserByClerkId, {clerkId});
  console.log("userProfile from use user profile hook>>", userProfile);
  return {
    userProfile,
    isLoading: userProfile === undefined,
    error: userProfile === null,
  };
}

