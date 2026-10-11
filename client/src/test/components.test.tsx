import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/ui/Button";
import { CalorieSummaryCard } from "../components/CalorieSummaryCard";
import { MacroProgressCard } from "../components/MacroProgressCard";
import { EmptyState } from "../components/ui/EmptyState";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Badge } from "../components/ui/Badge";

describe("Frontend UI Components", () => {
  it("renders Button correctly with text and responds to disabled prop", () => {
    render(<Button disabled>Click Me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it("renders CalorieSummaryCard with target, consumed, and remaining calories", () => {
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

    expect(screen.getByText(/2000/i)).toBeInTheDocument();
    expect(screen.getByText(/1400/i)).toBeInTheDocument();
    expect(screen.getAllByText(/600/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/70%/i)).toBeInTheDocument();
    expect(screen.getByText(/600 kcal remaining/i)).toBeInTheDocument();
  });

  it("renders CalorieSummaryCard with over-target warning when target exceeded", () => {
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

    expect(screen.getAllByText(/\+300/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Over/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders MacroProgressCard with macro targets and items", () => {
    render(
      <MacroProgressCard
        protein={{ consumed: 90, target: 120 }}
        carbs={{ consumed: 180, target: 240 }}
        fat={{ consumed: 45, target: 60 }}
        fiber={{ consumed: 22, target: 30 }}
      />
    );

    expect(screen.getAllByText(/Protein/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Carbohydrates/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Fat/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Fiber/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/90g/i)).toBeInTheDocument();
    expect(screen.getByText(/120g/i)).toBeInTheDocument();
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

  it("renders ConfirmDialog correctly when open", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Delete Food Entry"
        message="Are you sure you want to delete this meal log?"
        confirmText="Delete Meal"
        isDangerous={true}
      />
    );

    expect(screen.getByText("Delete Food Entry")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this meal log\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete meal/i })).toBeInTheDocument();
  });

  it("renders Badge with appropriate styling variant", () => {
    render(<Badge variant="success">High Protein</Badge>);
    expect(screen.getByText("High Protein")).toBeInTheDocument();
  });
});
