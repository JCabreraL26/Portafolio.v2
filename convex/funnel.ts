import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitLead = mutation({
  args: {
    userType: v.string(),
    challenge: v.string(),
    budgetRange: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      type: args.userType === "company" ? "HIGH_TICKET_CLIENT" : "RECRUITER",
      name: args.name,
      email: args.email,
      company: undefined,
      budget_range: args.budgetRange,
      challenge: args.challenge,
      project_summary: args.message || "",
      source: "FUNNEL_FORM",
      created_at: Date.now(),
    });
    
    return { leadId, status: "success" };
  },
});

export const getLeads = query({
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").take(100);
  },
});

export const getLeadById = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.leadId);
  },
});
