import React from "react";
import { SOPHeader as SOPHeaderType } from "@/types/sop";
import { HeaderIdentitySection } from "./HeaderIdentitySection";
import { HeaderTimelineSection } from "./HeaderTimelineSection";
import { HeaderRequirementSection } from "./HeaderRequirementSection";
import { HeaderAdditionalInfoSection } from "./HeaderAdditionalInfoSection";

interface Props {
  header: SOPHeaderType;
  setHeader: React.Dispatch<React.SetStateAction<SOPHeaderType>>;
}

export function SOPHeaderEditor({ header, setHeader }: Props) {
  const updateHeader = (key: keyof SOPHeaderType, value: string) => {
    setHeader((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 px-2 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HeaderIdentitySection header={header} updateHeader={updateHeader} />
      <HeaderTimelineSection header={header} updateHeader={updateHeader} />
      <HeaderRequirementSection header={header} updateHeader={updateHeader} />
      <HeaderAdditionalInfoSection header={header} updateHeader={updateHeader} />
    </div>
  );
}
