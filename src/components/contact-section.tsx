import { GithubLogoIcon, XLogoIcon } from "@phosphor-icons/react";
import CustomExternalLink from "./custom-external-link";
import { Button } from "./ui/button";
import { TabsContent } from "./ui/tabs";

export default function ContactSection() {
	return (
		<TabsContent
			className="space-y-6 rounded-lg border bg-card p-4 lg:p-8"
			value="about"
		>
			<div className="space-y-3">
				<p className="text-sm text-muted-foreground">
					This project is Open-Source.
				</p>
				<CustomExternalLink href={import.meta.env.VITE_GITHUB_REPO_LINK}>
					<Button variant="outline" className="gap-2">
						<GithubLogoIcon className="size-4" />
						<span>baychat</span>
					</Button>
				</CustomExternalLink>
			</div>

			<div className="space-y-3">
				<p className="text-sm text-muted-foreground">
					For bugs, features, or general inquiries:
				</p>
				<CustomExternalLink href={import.meta.env.VITE_X_URL}>
					<Button variant="outline" className="gap-2">
						<XLogoIcon className="size-4" />
						<span>Contact</span>
					</Button>
				</CustomExternalLink>
			</div>
		</TabsContent>
	);
}
