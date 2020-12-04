import { useCallback } from 'react';

//для вывода сообщения об ошибке
export const useMessage = () => {
  return useCallback((text) => {
    if (window.M && text) {
      window.M.toast({ html: text });
    }
  }, []);
};
