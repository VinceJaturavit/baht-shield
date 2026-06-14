"use client";

import { useMemo, useState } from "react";
import type { OpsReviewPack } from "@/lib/ops/reviews-types";
import {
  EMPTY_MEMBER_FILTERS,
  filterByMemberFilters,
  OPS_ROLE_FILTER_OPTIONS,
  type OpsRoleFilter,
} from "@/lib/ops/filters";
import { getReviewHeadline } from "@/lib/ops/reviews";
import { OpsReviewAnalystList } from "./OpsReviewAnalystList";
import { OpsFilterBar } from "../filters/OpsFilterBar";
import { OpsFilterSelect } from "../filters/OpsFilterSelect";
import { OpsFilterEmptyState } from "../filters/OpsFilterEmptyState";

interface Props {
  analysts: OpsReviewPack[];
  onOpenReview: (analystId: string) => void;
}

export function OpsReviewsLanding({ analysts, onOpenReview }: Props) {
  const [filters, setFilters] = useState(EMPTY_MEMBER_FILTERS);

  const filteredAnalysts = useMemo(
    () => filterByMemberFilters(analysts, filters),
    [analysts, filters],
  );

  const fraudAnalysts = filteredAnalysts.filter((a) => a.role === "Fraud Analyst");
  const juniorAnalysts = filteredAnalysts.filter((a) => a.role === "Junior Analyst");

  const clearAll = () => setFilters(EMPTY_MEMBER_FILTERS);

  return (
    <div className="min-w-0 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-ourox-ink">Reviews</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ourox-ink/55">
          Review packs bring workload, performance, quality, behaviour, and reliability into one
          read-only view for fair analyst conversations.
        </p>
      </div>

      <OpsFilterBar
        searchId="ops-reviews-search"
        searchValue={filters.text}
        onSearchChange={(text) => setFilters((prev) => ({ ...prev, text }))}
        searchPlaceholder="Search analysts…"
        searchLabel="Search analysts"
        resultCount={filteredAnalysts.length}
        resultLabel={filteredAnalysts.length === 1 ? "analyst" : "analysts"}
        filterValues={{ role: filters.role }}
        onClearAll={clearAll}
      >
        <OpsFilterSelect<OpsRoleFilter>
          id="ops-reviews-role"
          label="Role"
          value={filters.role}
          options={OPS_ROLE_FILTER_OPTIONS}
          onChange={(role) => setFilters((prev) => ({ ...prev, role }))}
        />
      </OpsFilterBar>

      {filteredAnalysts.length === 0 ? (
        <OpsFilterEmptyState
          title="No analysts match the current filters."
          description="Clear filters or search for another analyst."
        />
      ) : (
        <>
          <OpsReviewAnalystList
            groupLabel="Fraud Analysts"
            analysts={fraudAnalysts}
            getHeadline={getReviewHeadline}
            onOpenReview={onOpenReview}
          />
          <OpsReviewAnalystList
            groupLabel="Junior Analysts"
            analysts={juniorAnalysts}
            getHeadline={getReviewHeadline}
            onOpenReview={onOpenReview}
          />
        </>
      )}
    </div>
  );
}
