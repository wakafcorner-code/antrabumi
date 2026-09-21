import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Button } from "../Button";

describe("Button component", () => {
  it("renders children correctly as a button", () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute("type", "button");
  });

  it("renders as anchor tag when href is passed", () => {
    render(<Button href="/contact">Contact Link</Button>);
    const linkElement = screen.getByRole("link", { name: /contact link/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/contact");
  });

  it("disables button when disabled prop is provided", () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByRole("button", { name: /disabled button/i });
    expect(buttonElement).toBeDisabled();
  });

  it("sets aria-busy when isLoading is true", () => {
    render(<Button isLoading>Loading Button</Button>);
    const buttonElement = screen.getByRole("button", { name: /loading button/i });
    expect(buttonElement).toHaveAttribute("aria-busy", "true");
    expect(buttonElement).toBeDisabled();
  });
});
