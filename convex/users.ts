/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConvexError, v } from "convex/values"; 
import { internalMutation, query } from "./_generated/server"; 

/**
 * Membuat user baru dengan tokenIdentifier, email, image, dan name.
 * Jika berhasil, maka akan mengembalikan dokumen user yang baru dibuat.
 * Jika gagal, maka akan mengembalikan ConvexError.
 */

export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(), // TokenIdentifier user
        email: v.string(), // Email user
        image: v.string(), // Image user
        name: v.string(), // Nama user
    },
    handler: async (ctx, args) => {
        // Membuat dokumen user baru dengan data yang diberikan
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            email: args.email,
            image: args.image,
            name: args.name,
            isOnline: true, // User online secara default
        });
    }
})

/**
 * Mengubah status user menjadi offline.
 * Jika user tidak ditemukan, maka akan mengembalikan ConvexError.
 */
export const setUserOffline = internalMutation({
    args: { tokenIdentifier: v.string() }, // TokenIdentifier user
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique(); // Cari dokumen user dengan tokenIdentifier yang sama

        if (!user) {
            throw new ConvexError("User not found"); // Jika user tidak ditemukan, maka mengembalikan ConvexError
        }

        await ctx.db.patch(user._id, { isOnline: false }); // Mengubah status user menjadi offline
    }
})

/**
 * Mengubah status user menjadi online.
 * Jika user tidak ditemukan, maka akan mengembalikan ConvexError.
 */
export const setUserOnline = internalMutation({
    args: { tokenIdentifier: v.string() }, // TokenIdentifier user
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique(); // Cari dokumen user dengan tokenIdentifier yang sama

        if (!user) {
            throw new ConvexError("User not found"); // Jika user tidak ditemukan, maka mengembalikan ConvexError
        }

        await ctx.db.patch(user._id, { isOnline: true }); // Mengubah status user menjadi online
    }
})

/**
 * Mengubah image user yang memiliki tokenIdentifier yang sama.
 * Jika user tidak ditemukan, maka akan mengembalikan ConvexError.
 */
export const updateUser = internalMutation({
    args: {
        tokenIdentifier: v.string(), // TokenIdentifier user
        image: v.string(), // Image yang akan diubah
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique(); // Cari dokumen user dengan tokenIdentifier yang sama

        if (!user) {
            throw new ConvexError("User not found"); // Jika user tidak ditemukan, maka mengembalikan ConvexError
        }

        await ctx.db.patch(user._id, { image: args.image }); // Mengubah image user
    } 
})

export const getUser = query({
    args: {}, // TokenIdentifier user
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // Memastikan user sudah login

        if(!identity){
            throw new ConvexError("User not found");
        }
        // Fungsi ini mengambil semua user kecuali user yang sedang login
        const users = await ctx.db.query("users").collect();
        return users.filter((u) => u.tokenIdentifier !== identity.tokenIdentifier);
    }
})

export const getMe = query({
    args:{},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // Memastikan user sudah login

        if(!identity){
            throw new ConvexError("User not found");
        }
        // Fungsi ini mengambil user yang sedang login berdasarkan tokenIdentifiernya
        const user = await ctx.db
            .query("users")
            // Gunakan index by_tokenIdentifier untuk mempercepat pencarian
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            // Mengembalikan satu dokumen user yang sesuai dengan tokenIdentifier
            .unique()
        
        if(!user){
            throw new ConvexError("User not found");
        }
        return user
    }
}) 

export const getGroupMembers = query({
    args :{conversationId: v.id("conversations")},
    handler: async (ctx, args) => {
        const  identity = await ctx.auth.getUserIdentity(); // Memastikan user sudah login

        if(!identity){
            throw new ConvexError("Unauthorized");
        }
        const conversation = await ctx.db
        .query("conversations")
        .filter((q) => q.eq(q.field("_id"), args.conversationId))
        .first();

        if(!conversation){
            throw new ConvexError("Conversation not found");
        } 

        const users = await ctx.db.query("users").collect();
        const justGroupMembers = users.filter((u) => conversation.participants.includes(u._id));
        return justGroupMembers
    }
})