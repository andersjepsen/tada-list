import React from "react";

interface SectionProps {
  children: React.ReactNode;
}

function Section({ children }: SectionProps) {
  return (
    <div className="mb-4 rounded-lg hover:border-2 hover:p-2 hover:-mt-2.5 hover:mb-1.5 hover:-mx-2.5 hover:shadow-sm">
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  children: React.ReactNode;
}

function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <div className="group flex justify-between items-center pb-2">
      {children}
    </div>
  );
}

interface SectionHeaderActionsProps {
  children: React.ReactNode;
}

function SectionHeaderActions({ children }: SectionHeaderActionsProps) {
  return <div className="invisible group-hover:visible">{children}</div>;
}

Section.Header = SectionHeader;
Section.HeaderActions = SectionHeaderActions;

export { Section };
