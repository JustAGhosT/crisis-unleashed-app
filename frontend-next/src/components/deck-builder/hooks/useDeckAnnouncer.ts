import React from "react";

export function useDeckAnnouncer() {
  const [message, setMessage] = React.useState("");
  const announceAdd = React.useCallback(
    (name: string) => setMessage(`${name} added to deck`),
    [],
  );
  const announceRemove = React.useCallback(
    (name: string) => setMessage(`${name} removed from deck`),
    [],
  );
  const clear = React.useCallback(() => setMessage(""), []);
  return { message, announceAdd, announceRemove, clear };
}
