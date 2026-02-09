/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as betterAuth from "../betterAuth.js";
import type * as chats from "../chats.js";
import type * as folders from "../folders.js";
import type * as functions from "../functions.js";
import type * as messages from "../messages.js";
import type * as migrations_assignMessageUuid from "../migrations/assignMessageUuid.js";
import type * as migrations_setsIsBranched from "../migrations/setsIsBranched.js";
import type * as model_chats from "../model/chats.js";
import type * as model_users from "../model/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  betterAuth: typeof betterAuth;
  chats: typeof chats;
  folders: typeof folders;
  functions: typeof functions;
  messages: typeof messages;
  "migrations/assignMessageUuid": typeof migrations_assignMessageUuid;
  "migrations/setsIsBranched": typeof migrations_setsIsBranched;
  "model/chats": typeof model_chats;
  "model/users": typeof model_users;
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
