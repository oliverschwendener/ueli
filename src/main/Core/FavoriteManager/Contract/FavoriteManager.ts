export interface FavoriteManager {
    add(id: string): Promise<void>;
    remove(id: string): Promise<void>;
    getAll(): string[];
}
