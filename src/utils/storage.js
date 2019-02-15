export const localStorage = {
  storage: window && window.localStorage,
  setItem(key, value) {
    return this.storage.setItem(key, JSON.stringify(value));
  },
  
  getItem(key) {
    try {
      const value = this.storage.getItem(key);
      return value && typeof value !== 'undefined'
        ? JSON.parse(value) : undefined;
    } catch (e) {
    }
    return undefined;
  },
  removeItem(key) {
    return this.storage.removeItem(key);
  },
  
  clear() {
    return this.storage.clear();
  }
};

export const sessionStorage = {
  storage: window && window.sessionStorage,
  setItem(key, value) {
    return this.storage.setItem(key, JSON.stringify(value));
  },
  
  getItem(key) {
    try {
      const value = this.storage.getItem(key);
      return value && typeof value !== 'undefined'
        ? JSON.parse(value) : undefined;
    } catch (e) {
    }
    return undefined;
  },
  removeItem(key) {
    return this.storage.removeItem(key);
  },
  
  clear() {
    return this.storage.clear();
  }
};
