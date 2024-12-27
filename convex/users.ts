import { Id } from "./_generated/dataModel";
import { QueryCtx, internalMutation, query, mutation } from "./_generated/server";
import { v } from "convex/values";
export const getAllUsers=query({
    args:{},
    handler:async(ctx)=>{
        return ctx.db.query("users").collect();
    }
})

export const createUser=internalMutation({
    args:{
        clerkId: v.optional(v.string()),
        email: v.optional(v.string()),
        first_name: v.optional(v.string()),
        last_name: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        username: v.union(v.string(), v.null()),
        bio: v.optional(v.string()),
        websiteUrl: v.optional(v.string()),
        followersCount:v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await ctx.db.insert('users', {
          ...args,
          username: args.username || `${args.first_name}${args.last_name}`,
        });
        return userId; // go and set in https.ts inside user.created
      },
})

export const getUserByClerkId=query({
    args:{
        clerkId:v.optional( v.string())
    },
    handler: async (ctx, args)=>{
        return await ctx.db.query("users").filter((q)=> q.eq(q.field('clerkId'), args.clerkId)).unique();
    },
})

export const getUserById = query({
    args: {
      userId: v.id('users'),
    },
    handler: async (ctx, args) => {
      const user = await ctx.db.get(args.userId);
      if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
        return user;
      }
  
      const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);
  
      return {
        ...user,
        imageUrl: url,
      };
    },
  });


// update user
  export const updateUser = mutation({
    args: {
      _id: v.id('users'),
      bio: v.optional(v.string()),
      websiteUrl: v.optional(v.string()),
      profilePicture: v.optional(v.string()),
      pushToken: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      await getCurrentUserOrThrow(ctx);
  
      const { _id, ...rest } = args;
      return await ctx.db.patch(_id, rest);
    },
  });

  
export const generateUploadUrl = mutation(async (ctx) => {
  await getCurrentUserOrThrow(ctx);

  return await ctx.storage.generateUploadUrl();
});

export const updateImage = mutation({
  args: { storageId: v.id('_storage'), _id: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, {
      imageUrl: args.storageId,
    });
  },
});

  // check user identity
export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`);
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query('users')
    .withIndex('byClerkId', (q) => q.eq('clerkId', externalId))
    .unique();
}