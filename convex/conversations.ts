import { ConvexError, v } from "convex/values"; 
import { mutation, query } from "./_generated/server";

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

export const getMyConversations = query({
    args: {},
    handler: async (ctx) => {
        // Mendapatkan user yang sedang login
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new ConvexError("Unauthorized"); // Jika tidak ada user yang login, maka akan mengembalikan ConvexError dengan pesan "Unauthorized"
        }

        // Mendapatkan dokumen user dengan tokenIdentifier yang sama
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();
        if(!user) {
            throw new ConvexError("User Not Found"); // Jika user tidak ditemukan, maka akan mengembalikan ConvexError dengan pesan "User Not Found"
        }

        // Mendapatkan semua dokumen conversation
        const conversations = await ctx.db.query("conversations").collect()
        
        // Mencari dokumen conversation yang memiliki user yang sedang login
        const myConversation = conversations.filter(conversation => conversation.participants.includes(user._id));
        
        // Membuat array yang berisi detail dari masing-masing conversation
        const conversationWithDetails = await Promise.all(
            myConversation.map(async (conversation) => {
                // Mendapatkan detail user lainnya dalam conversation
                let userDetails ={}
                if(!conversation.isGroup) {
                    // Mendapatkan userId lainnya dalam conversation
                    const otherUserId = conversation.participants.find((id) => id !== user._id);
                    // Mendapatkan dokumen user dengan userId yang sama
                    const userProfile = await ctx.db
                    .query("users")
                    .filter((q) => q.eq(q.field("_id"), otherUserId))
                    .take(1);

                    // Menyimpan detail user lainnya dalam conversation
                    userDetails = userProfile[0];
                }
                // Mendapatkan message terakhir dalam conversation
                const lastMessage = await ctx.db
                    .query("message")
                    .filter((q) => q.eq(q.field("conversation"), conversation._id))
                    .order("desc")
                    .take(1)

                // Membuat objek yang berisi detail conversation dan lastMessage
                return {
                    ...userDetails,
                    ...conversation,
                    lastMessage: lastMessage[0] || null
                }
            })
            
        )
        // Mengembalikan array yang berisi detail conversation
        return conversationWithDetails
    }

})
