/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AuthImport } from './routes/_auth'
import { Route as AuthIndexImport } from './routes/_auth.index'
import { Route as ShareChatIdImport } from './routes/share.$chatId'
import { Route as AuthSettingsImport } from './routes/_auth.settings'
import { Route as AuthChatChatIdImport } from './routes/_auth.chat.$chatId'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthRoute,
} as any)

const ShareChatIdRoute = ShareChatIdImport.update({
  id: '/share/$chatId',
  path: '/share/$chatId',
  getParentRoute: () => rootRoute,
} as any)

const AuthSettingsRoute = AuthSettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => AuthRoute,
} as any)

const AuthChatChatIdRoute = AuthChatChatIdImport.update({
  id: '/chat/$chatId',
  path: '/chat/$chatId',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/settings': {
      id: '/_auth/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthSettingsImport
      parentRoute: typeof AuthImport
    }
    '/share/$chatId': {
      id: '/share/$chatId'
      path: '/share/$chatId'
      fullPath: '/share/$chatId'
      preLoaderRoute: typeof ShareChatIdImport
      parentRoute: typeof rootRoute
    }
    '/_auth/': {
      id: '/_auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof AuthImport
    }
    '/_auth/chat/$chatId': {
      id: '/_auth/chat/$chatId'
      path: '/chat/$chatId'
      fullPath: '/chat/$chatId'
      preLoaderRoute: typeof AuthChatChatIdImport
      parentRoute: typeof AuthImport
    }
  }
}

// Create and export the route tree

interface AuthRouteChildren {
  AuthSettingsRoute: typeof AuthSettingsRoute
  AuthIndexRoute: typeof AuthIndexRoute
  AuthChatChatIdRoute: typeof AuthChatChatIdRoute
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthSettingsRoute: AuthSettingsRoute,
  AuthIndexRoute: AuthIndexRoute,
  AuthChatChatIdRoute: AuthChatChatIdRoute,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof AuthRouteWithChildren
  '/login': typeof LoginRoute
  '/settings': typeof AuthSettingsRoute
  '/share/$chatId': typeof ShareChatIdRoute
  '/': typeof AuthIndexRoute
  '/chat/$chatId': typeof AuthChatChatIdRoute
}

export interface FileRoutesByTo {
  '/login': typeof LoginRoute
  '/settings': typeof AuthSettingsRoute
  '/share/$chatId': typeof ShareChatIdRoute
  '/': typeof AuthIndexRoute
  '/chat/$chatId': typeof AuthChatChatIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_auth': typeof AuthRouteWithChildren
  '/login': typeof LoginRoute
  '/_auth/settings': typeof AuthSettingsRoute
  '/share/$chatId': typeof ShareChatIdRoute
  '/_auth/': typeof AuthIndexRoute
  '/_auth/chat/$chatId': typeof AuthChatChatIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/login'
    | '/settings'
    | '/share/$chatId'
    | '/'
    | '/chat/$chatId'
  fileRoutesByTo: FileRoutesByTo
  to: '/login' | '/settings' | '/share/$chatId' | '/' | '/chat/$chatId'
  id:
    | '__root__'
    | '/_auth'
    | '/login'
    | '/_auth/settings'
    | '/share/$chatId'
    | '/_auth/'
    | '/_auth/chat/$chatId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthRoute: typeof AuthRouteWithChildren
  LoginRoute: typeof LoginRoute
  ShareChatIdRoute: typeof ShareChatIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthRoute: AuthRouteWithChildren,
  LoginRoute: LoginRoute,
  ShareChatIdRoute: ShareChatIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/login",
        "/share/$chatId"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/settings",
        "/_auth/",
        "/_auth/chat/$chatId"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_auth/settings": {
      "filePath": "_auth.settings.tsx",
      "parent": "/_auth"
    },
    "/share/$chatId": {
      "filePath": "share.$chatId.tsx"
    },
    "/_auth/": {
      "filePath": "_auth.index.tsx",
      "parent": "/_auth"
    },
    "/_auth/chat/$chatId": {
      "filePath": "_auth.chat.$chatId.tsx",
      "parent": "/_auth"
    }
  }
}
ROUTE_MANIFEST_END */
