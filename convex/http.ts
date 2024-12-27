import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http= httpRouter();
export const handleClerkWebhook = httpAction(async (ctx, request) => {
  // implementation will be here
  const {data, type}= await request.json();
  console.log("handleClerkWebhook date ", data);

  switch (type) {
    case "user.created":
        await ctx.runMutation(internal.users.createUser, {
            clerkId: data.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            imageUrl: data.imageUrl,
            username: data.username,
            bio: data.bio,
            websiteUrl: data.websiteUrl,
            followersCount: data.followersCount
        })
      console.log("user created");
      break;
    case "user.updated":
      console.log("user updated");
      break;
    case "user.deleted":
      console.log("user deleted");
      break;
  }
  return new Response(null, { status: 200 });
});

http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: handleClerkWebhook,
  });

export default http;
// https://blessed-jellyfish-235.convex.cloud 
// https://blessed-jellyfish-235.convex.site/clerk-users-webhook