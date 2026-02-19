import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import ApiKeysForm from "~/components/api-keys-form";
import AppearanceSettings from "~/components/appearance-settings";
import ChatHistoryManager from "~/components/chat-history-manager";
import ContactSection from "~/components/contact-section";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useIsMobile } from "~/hooks/use-mobile";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/_auth/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const isMobile = useIsMobile();
	const navigate = useNavigate();

	return (
		<section className="h-svh max-h-svh py-4 pb-8 lg:py-6 lg:pb-12">
			<ScrollArea className="h-full w-full">
				<div className="mx-auto w-full max-w-5xl space-y-4 px-4 lg:space-y-6 lg:px-6">
					{/* Header - responsive layout */}
					<div className="flex items-center justify-between gap-4">
						<h1 className="text-2xl font-bold lg:text-3xl">Settings</h1>
						<Button
							onClick={async () => {
								await authClient.signOut({
									fetchOptions: {
										onSuccess: () => {
											location.reload();
										},
									},
								});
								navigate({ to: "/login" });
							}}
							size={isMobile ? "icon" : "default"}
							variant="secondary"
						>
							<LogOutIcon className="h-4 w-4" />
							<span className="hidden lg:inline">Sign out</span>
						</Button>
					</div>

					<Tabs className="w-full flex-col" defaultValue="apiKeys">
						{/* Scrollable tabs on mobile */}
						<div className="w-full overflow-x-auto lg:w-fit">
							<TabsList className="grid w-full min-w-fit grid-cols-4 lg:w-auto">
								<TabsTrigger
									className="text-xs whitespace-nowrap sm:text-sm"
									value="apiKeys"
								>
									API Keys
								</TabsTrigger>
								<TabsTrigger
									className="text-xs whitespace-nowrap sm:text-sm"
									value="chatHistory"
								>
									Chat History
								</TabsTrigger>
								<TabsTrigger
									className="text-xs whitespace-nowrap sm:text-sm"
									value="appearance"
								>
									Appearance
								</TabsTrigger>
								<TabsTrigger
									className="text-xs whitespace-nowrap sm:text-sm"
									value="about"
								>
									Contact
								</TabsTrigger>
							</TabsList>
						</div>

						{/* Content area with responsive spacing */}
						<div className="mt-4 lg:mt-6">
							<ApiKeysForm />
							<ChatHistoryManager />
							<AppearanceSettings />
							<ContactSection />
						</div>
					</Tabs>
				</div>
			</ScrollArea>
		</section>
	);
}
