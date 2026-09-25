"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { SizeSelectionModal, SizeOption } from "@/components/product/SizeSelectionModal";

export interface OpenSizeModalOptions {
  productName: string;
  brand?: string;
  seller?: string;
  image?: string;
  sizes: SizeOption[];
  defaultPrice?: number;
  defaultMrp?: number;
  onConfirm: (selectedSize: SizeOption) => Promise<void>;
}

interface SizeModalContextType {
  openSizeModal: (options: OpenSizeModalOptions) => void;
  closeSizeModal: () => void;
}

const SizeModalContext = createContext<SizeModalContextType | undefined>(undefined);

export function SizeModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<OpenSizeModalOptions | null>(null);

  const openSizeModal = useCallback((options: OpenSizeModalOptions) => {
    setModalOptions(options);
    setIsOpen(true);
  }, []);

  const closeSizeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SizeModalContext.Provider value={{ openSizeModal, closeSizeModal }}>
      {children}
      {modalOptions && (
        <SizeSelectionModal
          isOpen={isOpen}
          onClose={closeSizeModal}
          productName={modalOptions.productName}
          brand={modalOptions.brand}
          seller={modalOptions.seller}
          image={modalOptions.image}
          sizes={modalOptions.sizes}
          defaultPrice={modalOptions.defaultPrice}
          defaultMrp={modalOptions.defaultMrp}
          onConfirm={modalOptions.onConfirm}
        />
      )}
    </SizeModalContext.Provider>
  );
}

export function useSizeModal() {
  const context = useContext(SizeModalContext);
  if (!context) {
    throw new Error("useSizeModal must be used within a SizeModalProvider");
  }
  return context;
}
