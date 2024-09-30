import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// export const createUser = internalMutation({
//   args: {
//     clerckId: v.string(),
//     email: v.string(),
//     imageUrl: v.string(),
//     name: v.string(),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.insert("users", {
//       clerckId: args.clerckId,
//       email: args.email,
//       imageUrl: args.imageUrl,
//       name: args.name,
//     });
//   },
// });

export const createUser = internalMutation({
  args: {
    clerckId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { clerckId, email, imageUrl, name }) => {
    await ctx.db.insert("users", {
      clerckId,
      email,
      imageUrl,
      name,
    });
  },
});
