/**
 * 读写本地存储
 */
export const saveLocalItem = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const readLocalItem = (key: string) => {
  return JSON.parse(localStorage.getItem(key) ?? "{}");
};

/**
 * 读写会话存储
 */
export const saveSessionItem = (key: string, data: any) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const readSessionItem = (key: string) => {
  return JSON.parse(sessionStorage.getItem(key) ?? "{}");
};
