import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createTag, getTags } from "../endpoints/tags";

const TagsContext = createContext(null);

export function TagsProvider({ children }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const tagMap = useMemo(() => {
    const map = {};
    tags.forEach((t) => {
      map[t.name.toLowerCase()] = t.emoji;
    });
    return map;
  }, [tags]);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getTags();
      setTags(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const addTag = async ({ name, emoji }) => {
    const { data, error } = await createTag({ name, emoji });
    if (!error) {
      setTags((prev) => {
        const existingIndex = prev.findIndex((t) => t.name === data.name);
        if (existingIndex >= 0) {
          const copy = [...prev];
          copy[existingIndex] = data;
          return copy;
        }
        return [...prev, data].sort((a, b) => a.name.localeCompare(b.name));
      });
    }
    return { data, error };
  };

  return (
    <TagsContext.Provider value={{ tags, tagMap, loading, refresh, addTag }}>
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  return useContext(TagsContext);
}
