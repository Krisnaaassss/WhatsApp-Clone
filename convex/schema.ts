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
        groupImage : v.optional(v.string()),
        admin : v.optional(v.id("users")),
    })
})
