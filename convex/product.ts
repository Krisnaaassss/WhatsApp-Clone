import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

export const getProducts = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("products").collect()
    }
})

export const addProduct = mutation({
    args: {
        name: v.string(),
        price: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("products", args)
    }
})

export const deleteProduct = mutation({
    args: {
        id: v.id("products"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id)
    }
})