// Offline caching utility using IndexedDB
// Stores study materials, lecture summaries, flashcards, and quizzes locally

interface CachedMaterial {
  id: string;
  lectureId: string;
  type: "summary" | "notes" | "flashcards" | "quizzes" | "guide";
  content: string;
  timestamp: number;
}

interface CachedLecture {
  id: string;
  filename: string;
  uploadedAt: number;
  status: "processing" | "completed" | "failed";
}

const DB_NAME = "StudyAI";
const DB_VERSION = 1;
const STORES = {
  lectures: "lectures",
  materials: "materials",
  syncQueue: "syncQueue",
};

class OfflineCache {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("Failed to open IndexedDB");
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(STORES.lectures)) {
          db.createObjectStore(STORES.lectures, { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains(STORES.materials)) {
          db.createObjectStore(STORES.materials, { keyPath: "id" });
          db.createObjectStore(STORES.materials).createIndex(
            "lectureId",
            "lectureId"
          );
        }

        if (!db.objectStoreNames.contains(STORES.syncQueue)) {
          db.createObjectStore(STORES.syncQueue, { keyPath: "id" });
        }
      };
    });
  }

  async cacheMaterial(material: CachedMaterial): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.materials], "readwrite");
      const store = transaction.objectStore(STORES.materials);

      material.timestamp = Date.now();
      const request = store.put(material);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getMaterial(
    id: string
  ): Promise<CachedMaterial | undefined> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.materials], "readonly");
      const store = transaction.objectStore(STORES.materials);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getMaterialsByLecture(
    lectureId: string
  ): Promise<CachedMaterial[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.materials], "readonly");
      const store = transaction.objectStore(STORES.materials);
      const index = store.index("lectureId");
      const request = index.getAll(lectureId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async cacheLecture(lecture: CachedLecture): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.lectures], "readwrite");
      const store = transaction.objectStore(STORES.lectures);

      lecture.uploadedAt = Date.now();
      const request = store.put(lecture);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getLecture(id: string): Promise<CachedLecture | undefined> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.lectures], "readonly");
      const store = transaction.objectStore(STORES.lectures);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAllLectures(): Promise<CachedLecture[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.lectures], "readonly");
      const store = transaction.objectStore(STORES.lectures);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addToSyncQueue(action: {
    id: string;
    type: string;
    data: unknown;
  }): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.syncQueue], "readwrite");
      const store = transaction.objectStore(STORES.syncQueue);

      const request = store.put({
        id: action.id,
        type: action.type,
        data: action.data,
        timestamp: Date.now(),
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getSyncQueue(): Promise<Array<unknown>> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.syncQueue], "readonly");
      const store = transaction.objectStore(STORES.syncQueue);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async clearSyncQueue(): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.syncQueue], "readwrite");
      const store = transaction.objectStore(STORES.syncQueue);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async isOnline(): Promise<boolean> {
    return navigator.onLine;
  }

  async syncWithServer(): Promise<void> {
    if (!navigator.onLine) {
      console.log("Offline mode - sync deferred");
      return;
    }

    try {
      const syncQueue = await this.getSyncQueue();
      if (syncQueue.length === 0) return;

      // TODO: Implement actual sync with backend API
      console.log("Syncing with server...", syncQueue);

      // Clear sync queue after successful sync
      await this.clearSyncQueue();
    } catch (error) {
      console.error("Sync error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const offlineCache = new OfflineCache();

// Initialize on app load
offlineCache.init().catch((error) => {
  console.error("Failed to initialize offline cache:", error);
});

// Listen for online/offline events
window.addEventListener("online", () => {
  console.log("Back online - syncing...");
  offlineCache.syncWithServer().catch(console.error);
});

window.addEventListener("offline", () => {
  console.log("Offline mode - changes will sync when online");
});

export default OfflineCache;
