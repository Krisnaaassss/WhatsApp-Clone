import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users : defineTable({
        name : v.optional(v.string()),
        email : v.string(),
        image : v.string(),
        tokenIdentifier: v.string(), 
        isOnline: v.boolean(),
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),
    // fungsi kode di atas adalah membuat index pada kolom tokenIdentifier
    // sehingga saat kita melakukan query berdasarkan tokenIdentifier,
    // convex dapat mencari dokumen yang sesuai dengan lebih cepat
    conversations : defineTable({
        participants : v.array(v.id("users")),
        isGroup : v.boolean(),
        groupName : v.optional(v.string()),
        groupImage : v.optional(v.id("_storage")),
        admin : v.optional(v.id("users")),
        
    }),
    message : defineTable({
        conversation : v.id("conversations"),
        messageType : v.union(v.literal("text"), v.literal("image"), v.literal("file"), v.literal("video")),
        content : v.string(),
        sender : v.string() || v.id("users"),
    }).index("by_conversation", ["conversation"]),
})
