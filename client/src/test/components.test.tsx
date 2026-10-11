import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/ui/Button";
import { CalorieSummaryCard } from "../components/CalorieSummaryCard";
import { MacroProgressCard } from "../components/MacroProgressCard";
import { EmptyState } from "../components/ui/EmptyState";

describe("Frontend UI Components", () => {
  it("renders Button correctly with text and responds to disabled prop", () => {
    render(<Button disabled>Click Me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it("renders CalorieSummaryCard with target and remaining calories", () => {
    render(
      <CalorieSummaryCard
        targetCalories={2000}
        consumedCalories={1400}
        remainingCalories={600}
        isOverTarget={false}
        overTargetCalories={0}
        percentage={70}
      />
    );

    expect(screen.getByText("2000")).toBeInTheDocument();
    expect(screen.getByText("1400")).toBeInTheDocument();
    expect(screen.getByText("600")).toBeInTheDocument();
    expect(screen.getByText(/70% reached/i)).toBeInTheDocument();
  });

  it("renders CalorieSummaryCard with over-budget warning when target exceeded", () => {
    render(
      <CalorieSummaryCard
        targetCalories={2000}
        consumedCalories={2300}
        remainingCalories={0}
        isOverTarget={true}
        overTargetCalories={300}
        percentage={115}
      />
    );

    expect(screen.getByText(/Over Budget \(\+300 kcal\)/i)).toBeInTheDocument();
  });

  it("renders MacroProgressCard with macro targets", () => {
    render(
      <MacroProgressCard
        protein={{ consumed: 90, target: 120 }}
        carbs={{ consumed: 180, target: 240 }}
        fat={{ consumed: 45, target: 60 }}
        fiber={{ consumed: 22, target: 30 }}
      />
    );

    expect(screen.getByText("Protein")).toBeInTheDocument();
    expect(screen.getByText("Carbohydrates")).toBeInTheDocument();
    expect(screen.getByText("Fat")).toBeInTheDocument();
    expect(screen.getByText("Dietary Fiber")).toBeInTheDocument();
  });

  it("renders EmptyState with title, description, and action button", () => {
    render(
      <EmptyState
        title="No Entries Found"
        description="Please add a meal to begin tracking."
        actionText="Log Now"
        onAction={() => {}}
      />
    );

    expect(screen.getByText("No Entries Found")).toBeInTheDocument();
    expect(screen.getByText(/Please add a meal to begin tracking/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log now/i })).toBeInTheDocument();
  });
});
