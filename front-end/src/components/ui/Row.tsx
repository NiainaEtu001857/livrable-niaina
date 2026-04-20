import React from "react";

type RowProps = {
  children: React.ReactNode;
};

export default function Row({ children }: RowProps) {
  return (
    <div className="row">
      {children}
    </div>
  );
}