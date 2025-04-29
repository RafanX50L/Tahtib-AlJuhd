import { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust import path as needed
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Adjust import path as needed
type RoleSelectionProps = {
  setRole: (value: string) => void;
};

export function RoleSelection({ setRole }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const selectRole = (role: string) => {
    setSelectedRole(role);
  };

  const continueToApp = () => {
    if (!selectedRole) return;

    // In a real app, you would:
    // 1. Save the user's role preference (localStorage/backend)
    // 2. Redirect to the appropriate dashboard
    console.log(`Redirecting to ${selectedRole} dashboard...`);
    setRole(selectedRole);
    // Example redirection:
    // window.location.href = selectedRole === 'user'
    //   ? '/user-dashboard'
    //   : '/trainer-dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-8">
          <svg
            className="w-10 h-10 text-indigo-500 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8H4V16H6M20 8H18V16H20M14 6H10V8H14V6ZM14 16H10V18H14V16ZM6 12H18V14H6V12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-2xl font-bold text-white">FormFit</h1>
        </div>

        {/* Role Selection */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <h2 className="text-xl font-semibold text-center text-white mb-2">
              How will you use FormFit?
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Card */}
            <div
              className={`bg-gray-700 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === "user"
                  ? "border-indigo-500"
                  : "border-transparent hover:border-gray-600"
              }`}
              onClick={() => selectRole("client")}
            >
              <div className="text-4xl mb-3">💪</div>
              <h3 className="text-lg font-medium text-white mb-2">
                I'm here to workout
              </h3>
              <p className="text-gray-400">
                Access personalized home workout plans, track your progress, and
                achieve your fitness goals.
              </p>
            </div>

            {/* Trainer Card */}
            <div
              className={`bg-gray-700 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === "trainer"
                  ? "border-indigo-500"
                  : "border-transparent hover:border-gray-600"
              }`}
              onClick={() => selectRole("trainer")}
            >
              <div className="text-4xl mb-3">👨‍🏫</div>
              <h3 className="text-lg font-medium text-white mb-2">
                I'm a fitness trainer
              </h3>
              <p className="text-gray-400">
                Create and share workout programs, manage clients, and grow your
                training business.
              </p>
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 mt-6"
              disabled={!selectedRole}
              onClick={continueToApp}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
