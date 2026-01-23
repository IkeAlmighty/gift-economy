import React, { createContext, useCallback, useState } from "react";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const show = useCallback((component, props = {}) => {
    const id = Math.random().toString(36).substring(2, 9);

    return new Promise((resolve) => {
      setModals((prev) => [
        ...prev,
        {
          id,
          component,
          props,
          resolve,
        },
      ]);
    });
  }, []);

  const hide = useCallback((id, result) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id);
      if (modal?.resolve) {
        modal.resolve(result);
      }
      return prev.filter((modal) => modal.id !== id);
    });
  }, []);

  const hideAll = useCallback(() => {
    setModals((prev) => {
      prev.forEach((modal) => {
        if (modal.resolve) {
          modal.resolve(undefined);
        }
      });
      return [];
    });
  }, []);

  const value = {
    show,
    hide,
    hideAll,
    modals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modals.map(({ id, component: Component, props }) => (
        <div key={id}>
          <Component {...props} modalId={id} onClose={(result) => hide(id, result)} />
        </div>
      ))}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
