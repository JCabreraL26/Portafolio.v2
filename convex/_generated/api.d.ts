/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agent_context_00_core_identity from "../agent/context/00_core_identity.js";
import type * as agent_context_01_qualifying_rules from "../agent/context/01_qualifying_rules.js";
import type * as agent_context_layers_general_faq from "../agent/context/layers/general_faq.js";
import type * as agent_context_layers_high_ticket from "../agent/context/layers/high_ticket.js";
import type * as agent_context_layers_recruiter from "../agent/context/layers/recruiter.js";
import type * as agent_orchestrator from "../agent/orchestrator.js";
import type * as constants from "../constants.js";
import type * as constants_proyectos from "../constants/proyectos.js";
import type * as functions_agenda from "../functions/agenda.js";
import type * as functions_ai_agenda from "../functions/ai/agenda.js";
import type * as functions_ai_gemini from "../functions/ai/gemini.js";
import type * as functions_ai_googleChatbot from "../functions/ai/googleChatbot.js";
import type * as functions_ai_ragv2 from "../functions/ai/ragv2.js";
import type * as functions_ai_security from "../functions/ai/security.js";
import type * as functions_ai_uxResearch_router from "../functions/ai/uxResearch/router.js";
import type * as functions_ai_zep from "../functions/ai/zep.js";
import type * as functions_proyectos from "../functions/proyectos.js";
import type * as funnel from "../funnel.js";
import type * as http from "../http.js";
import type * as seed from "../seed.js";
import type * as telegram from "../telegram.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "agent/context/00_core_identity": typeof agent_context_00_core_identity;
  "agent/context/01_qualifying_rules": typeof agent_context_01_qualifying_rules;
  "agent/context/layers/general_faq": typeof agent_context_layers_general_faq;
  "agent/context/layers/high_ticket": typeof agent_context_layers_high_ticket;
  "agent/context/layers/recruiter": typeof agent_context_layers_recruiter;
  "agent/orchestrator": typeof agent_orchestrator;
  constants: typeof constants;
  "constants/proyectos": typeof constants_proyectos;
  "functions/agenda": typeof functions_agenda;
  "functions/ai/agenda": typeof functions_ai_agenda;
  "functions/ai/gemini": typeof functions_ai_gemini;
  "functions/ai/googleChatbot": typeof functions_ai_googleChatbot;
  "functions/ai/ragv2": typeof functions_ai_ragv2;
  "functions/ai/security": typeof functions_ai_security;
  "functions/ai/uxResearch/router": typeof functions_ai_uxResearch_router;
  "functions/ai/zep": typeof functions_ai_zep;
  "functions/proyectos": typeof functions_proyectos;
  funnel: typeof funnel;
  http: typeof http;
  seed: typeof seed;
  telegram: typeof telegram;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
