"use client";

import { createContext, useContext } from "react";
import { ru } from "./ru";
import type { Dict, Locale } from "./index";

const DictContext = createContext<{ t: Dict; locale: Locale }>({ t: ru, locale: "ru" });

export function DictProvider({ t, locale, children }: { t: Dict; locale: Locale; children: React.ReactNode }) {
  return <DictContext value={{ t, locale }}>{children}</DictContext>;
}

/** Translations for client components. Server components take the dictionary as a prop. */
export function useDict() {
  return useContext(DictContext);
}
