import React from "react";


type BoxProps = {
  children: React.ReactNode;
  className?: string;
};
export const WarnBox = ({ children, className }: BoxProps) => {
    return (
        <div className={`warnBox ${className || ""}`}>
            {children}
        </div>
    );
}

export const InfoBox = ({ children, className }: BoxProps) => {
    return (
    <div className={`infoBox ${className || ""}`}>
        {children}
    </div>
    );
};