import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const sendTextMessage = mutation({
    args :{
        sender : v.string(),
        content : v.string(),
        conversation : v.id("conversations"),
    },
    handler : async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // Memastikan user sudah login
        if(!identity){
            throw new ConvexError("Not authenticated");
        }
        const user = await ctx.db.query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();

        if(!user){
            throw new ConvexError("User not found");
        }

        const conversation = await ctx.db.query("conversations")
        .filter((q) => q.eq(q.field("_id"), args.conversation))
        .first();

        if(!conversation){
            throw new ConvexError("Conversation not found");
        }
        
        if(!conversation.participants.includes(user._id)){
            throw new ConvexError("User not in conversation");
        }

        await ctx.db.insert("message",{
            content : args.content,
            sender : args.sender,
            conversationId : args.conversation,
            messageType : "text",
        })
    }
})