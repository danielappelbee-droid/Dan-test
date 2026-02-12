import { Code } from "lucide-react";

export default function GettingStarted() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-wise-interactive-accent rounded-xl p-2">
          <Code className="w-5 h-5 text-wise-interactive-primary" />
        </div>
        <h2 className="font-wise text-3xl">Getting Started with Claude Code</h2>
      </div>

      <div className="prose prose-lg max-w-none space-y-6 text-wise-content-secondary">
        <p className="text-lg leading-relaxed">
          This project is optimized for development with{" "}
          <a
            href="https://docs.claude.com/en/docs/claude-code/setup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-wise-link-content font-semibold underline hover:no-underline"
          >
            Claude Code
          </a>
          , making it easy to create new screens and flows with AI assistance.
        </p>

        <div>
          <h3 className="text-xl font-semibold text-wise-content-primary mb-3">Using Core Screens</h3>
          <p className="mb-3">The project includes a library of core screen patterns in <code className="bg-wise-background-neutral px-2 py-1 rounded text-sm">/src/app/screens/</code>:</p>
          <ul className="space-y-2 ml-6 list-disc mb-3">
            <li><strong>Dashboard Home</strong> - Card-based overview</li>
            <li><strong>Detail List</strong> - Scrollable list with search</li>
            <li><strong>Selection Screen</strong> - Option picker with continue action</li>
            <li><strong>Form Screen</strong> - Input collection with validation</li>
            <li><strong>Progress Tracker</strong> - Checklist or stepper</li>
          </ul>
          <p className="mb-3">To use a core screen in your prototype:</p>
          <ol className="space-y-2 ml-6 list-decimal">
            <li><strong>Browse</strong> the <a href="/screens-list" className="text-wise-link-content font-semibold underline hover:no-underline">Core Screens</a> page to find the pattern you need</li>
            <li><strong>Copy the file</strong> from <code className="bg-wise-background-neutral px-2 py-1 rounded text-sm">/src/app/screens/[name]/index.tsx</code> to your prototype directory</li>
            <li><strong>Customize freely</strong> - your changes won't affect other prototypes or the core library</li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-wise-content-primary mb-3">Creating New Flows</h3>
          <p className="mb-3">To create an entirely new prototype:</p>
          <ol className="space-y-2 ml-6 list-decimal">
            <li>
              <strong>Describe your flow</strong> to Claude Code with as much detail as possible:
              <ul className="ml-6 mt-2 space-y-1 list-disc">
                <li className="text-wise-content-tertiary">"Create a new account settings prototype with profile, security, and preferences screens"</li>
                <li className="text-wise-content-tertiary">"Build a card management flow with card list, card details, and freeze/unfreeze options"</li>
              </ul>
            </li>
            <li>
              Claude will:
              <ul className="ml-6 mt-2 space-y-1 list-disc">
                <li>Create the prototype directory structure</li>
                <li>Build all necessary view components</li>
                <li>Set up navigation between screens</li>
                <li>Add the prototype to the listings</li>
              </ul>
            </li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-wise-content-primary mb-3">Best Practices</h3>
          <ul className="space-y-2 ml-6 list-disc">
            <li><strong>Use existing patterns</strong> - Ask Claude to follow existing component and navigation patterns</li>
            <li><strong>Leverage the design system</strong> - Reference components from <code className="bg-wise-background-neutral px-2 py-1 rounded text-sm">/src/app/components/</code></li>
            <li><strong>Keep flows focused</strong> - Each prototype should represent one user journey</li>
            <li><strong>Test on mobile</strong> - All prototypes are mobile-first</li>
          </ul>
        </div>

        <div className="bg-wise-background-neutral rounded-2xl p-6 border border-wise-border-neutral">
          <h3 className="text-lg font-semibold text-wise-content-primary mb-3">Example Prompts</h3>
          <ul className="space-y-2 text-wise-content-tertiary">
            <li>"Add a payment confirmation screen to the calculator flow that shows after selecting a payment method"</li>
            <li>"Create a new notifications prototype with a list view and detail view"</li>
            <li>"Add error states to the verification flow"</li>
            <li>"Create a settings screen for the home prototype with toggle switches"</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-wise-content-primary mb-3">Project Structure</h3>
          <p className="mb-2">The codebase has three main directories:</p>
          <ul className="space-y-2 ml-6 list-disc">
            <li>
              <code className="bg-wise-background-neutral px-2 py-1 rounded text-sm">/src/app/screens/</code> - <strong>Core screen library</strong> (stable, reference implementations)
            </li>
            <li>
              <code className="bg-wise-background-neutral px-2 py-1 rounded text-sm">/src/app/prototypes/</code> - <strong>Experimental prototypes</strong> (self-contained, iterate freely)
              <ul className="mt-1 ml-6 space-y-1 list-disc text-sm">
                <li><code>page.tsx</code> - Main route component</li>
                <li><code>*View.tsx</code> - Screen components (copied from core)</li>
                <li><code>layout.tsx</code> - Optional wrapper</li>
              </ul>
            </li>
            <li>
              <code className="bg-wise-background-neutral px-2 py-1 rounded text-sm">/src/app/components/</code> - <strong>UI component library</strong> (shared across all prototypes)
            </li>
          </ul>
          <p className="mt-3 text-wise-content-tertiary text-sm">
            This architecture lets you copy core patterns, customize them in prototypes, and iterate rapidly without breaking anything.
          </p>
        </div>
      </div>
    </div>
  );
}
