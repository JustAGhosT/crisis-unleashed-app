import { PlayerRegistrationForm } from "@/components/forms/PlayerRegistrationForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock getFactionOptions function
jest.mock("@/data/factions", () => ({
  getFactionOptions: () => [
    { value: "solaris", label: "Solaris Federation" },
    { value: "umbral", label: "Umbral Covenant" },
    { value: "aeonic", label: "Aeonic Order" },
    { value: "primordial", label: "Primordial Wilds" },
    { value: "infernal", label: "Infernal Legion" },
    { value: "neuralis", label: "Neuralis Collective" },
    { value: "synthetic", label: "Synthetic Swarm" },
  ],
}));

describe("PlayerRegistrationForm", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it("renders the form correctly", () => {
    render(<PlayerRegistrationForm onSubmit={mockSubmit} />);

    // Check form elements are present
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred faction/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i accept the/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("validates form fields on user interaction", async () => {
    render(<PlayerRegistrationForm onSubmit={mockSubmit} />);

    // Get form fields
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);

    // Test username validation
    await userEvent.type(usernameInput, "a");
    await userEvent.tab(); // Move focus to trigger validation

    // Test email validation
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.tab(); // Move focus to trigger validation

    // Submit button should be disabled
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });
    expect(submitButton).toBeDisabled();

    // Form should not be submitted
    await userEvent.click(submitButton);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("validates username format correctly", async () => {
    render(<PlayerRegistrationForm onSubmit={mockSubmit} />);

    const usernameInput = screen.getByLabelText(/username/i);

    // Test invalid username (with special characters)
    await userEvent.type(usernameInput, "user@name!");

    // Check for validation error
    expect(
      await screen.findByText(
        /username can only contain letters, numbers, and underscores/i,
      ),
    ).toBeInTheDocument();

    // Clear and test valid username
    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, "valid_username123");

    // Validation error should be gone
    await waitFor(() => {
      expect(
        screen.queryByText(
          /username can only contain letters, numbers, and underscores/i,
        ),
      ).not.toBeInTheDocument();
    });
  });

  it("handles form submission correctly with valid data", async () => {
    render(<PlayerRegistrationForm onSubmit={mockSubmit} />);

    // Fill in the form with valid data
    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");

    // Select a faction
    await userEvent.selectOptions(
      screen.getByLabelText(/preferred faction/i),
      "solaris",
    );

    // Accept terms
    await userEvent.click(screen.getByLabelText(/i accept the/i));

    // Submit the form
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    // Check if onSubmit was called with the correct data
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        preferredFaction: "solaris",
        acceptTerms: true,
      });
    });
  });

  it("disables the submit button when isLoading is true", () => {
    render(<PlayerRegistrationForm onSubmit={mockSubmit} isLoading={true} />);

    const submitButton = screen.getByRole("button", {
      name: /creating account/i,
    });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Creating Account...");
  });

  it("handles terms and privacy policy button clicks", async () => {
    render(<PlayerRegistrationForm onSubmit={mockSubmit} />);

    // Get the modal trigger buttons
    const termsButton = screen.getByRole("button", {
      name: /terms and conditions/i,
    });
    const privacyButton = screen.getByRole("button", {
      name: /privacy policy/i,
    });

    // Click the buttons
    await userEvent.click(termsButton);
    await userEvent.click(privacyButton);

    // We can't easily test if the modals open since they're not implemented yet,
    // but we can check that clicking the buttons doesn't cause errors
    expect(termsButton).toBeInTheDocument();
    expect(privacyButton).toBeInTheDocument();
  });
});
