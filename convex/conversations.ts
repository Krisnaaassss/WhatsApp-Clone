import { ConvexError, v } from "convex/values"; 
import { mutation } from "./_generated/server";

//internalMutation dan mutation dalam Convex adalah bahwa internalMutation hanya dapat 
//diakses dari dalam Convex, sedangkan mutation dapat diakses dari klien.

export const createConversation = mutation({
    args: {
        participants: v.array(v.id("users")),
        isGroup: v.boolean(),
        groupName: v.optional(v.string()),
        groupImage: v.optional(v.id("_storage")),
        admin: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const identify = await ctx.auth.getUserIdentity();
        if (!identify) {
            throw new ConvexError("Unauthorized");
        }

        const existingConversation = await ctx.db
            .query("conversations")
            .filter((q) =>
                q.or(
                    q.eq(q.field("participants"), args.participants),
                    q.eq(q.field("participants"), args.participants.reverse())
                )
            )
            .first();

        if (existingConversation) {
            return existingConversation._id;
        }

        // Insert only the storage ID (groupImage) as requested
        const conversationId = await ctx.db.insert("conversations", {
            participants: args.participants,
            isGroup: args.isGroup,
            groupName: args.groupName,
            groupImage: args.groupImage,
            admin: args.admin
        });

        return conversationId;
    }
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
}) 