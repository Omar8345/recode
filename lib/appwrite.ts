import {
  Client,
  Account,
  TablesDB,
  ID,
  OAuthProvider,
  Permission,
  Role,
  Avatars,
} from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

export const account = new Account(client);
export const databases = new TablesDB(client);
export const avatars = new Avatars(client);
export { ID, OAuthProvider };

export const appwriteAuth = {
  async signUpWithEmail(email: string, password: string, name: string) {
    await account.create({ userId: ID.unique(), email, password, name });
    await account.createEmailPasswordSession({ email, password });
    await account.createEmailVerification({
      url: `${window.location.origin}/verify`,
    });
    return account.get();
  },
  async loginWithEmail(email: string, password: string) {
    return account.createEmailPasswordSession({ email, password });
  },
  async verifyEmail(userId: string, secret: string) {
    await account.updateEmailVerification({ userId, secret });
    return account.get();
  },
  async getCurrentUser() {
    try {
      return account.get();
    } catch {
      return null;
    }
  },
  async getCurrentSession() {
    try {
      return account.getSession({ sessionId: "current" });
    } catch {
      return null;
    }
  },
  async logout() {
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch (error) {
      throw error;
    }
  },
  async forgotPassword(email: string) {
    await account.createRecovery({
      email,
      url: `${window.location.origin}/reset-password`,
    });
  },
  async updatePassword(userId: string, secret: string, password: string) {
    await account.updateRecovery({ userId, secret, password });
  },
};

export const appwriteDB = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
  snippetsTableId: process.env.NEXT_PUBLIC_APPWRITE_SNIPPETS_TABLE_ID || "",

  async createSnippet(snippet: {
    title: string;
    code: string;
    language: string;
    tags: string[];
    userId: string;
  }) {
    return databases.createRow({
      databaseId: appwriteDB.databaseId,
      tableId: appwriteDB.snippetsTableId,
      rowId: ID.unique(),
      data: {
        title: snippet.title,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags,
        $createdAt: new Date().toISOString(),
      },
      permissions: [
        Permission.read(Role.user(snippet.userId)),
        Permission.update(Role.user(snippet.userId)),
        Permission.delete(Role.user(snippet.userId)),
      ],
    });
  },

  async listSnippets() {
    return databases.listRows({
      databaseId: appwriteDB.databaseId,
      tableId: appwriteDB.snippetsTableId,
    });
  },

  async updateSnippet(
    rowId: string,
    snippet: Partial<{
      title: string;
      code: string;
      language: string;
      tags: string[];
    }>,
  ) {
    return databases.updateRow({
      databaseId: appwriteDB.databaseId,
      tableId: appwriteDB.snippetsTableId,
      rowId,
      data: snippet,
    });
  },

  async deleteSnippet(rowId: string) {
    return databases.deleteRow({
      databaseId: appwriteDB.databaseId,
      tableId: appwriteDB.snippetsTableId,
      rowId,
    });
  },
};
