import CustomExternalLink from "./custom-external-link";
import GithubIcon from "./github-icon";
import XIcon from "./x-icon";
import { Button } from "./ui/button";
import { TabsContent } from "./ui/tabs";

export default function ContactSection() {
	return (
		<TabsContent
			className="bg-card space-y-6 rounded-xl border p-4 lg:p-8"
			value="about"
		>
			<div className="space-y-3">
				<p className="text-muted-foreground text-sm">
					This project is Open-Source.
				</p>
				<CustomExternalLink href={import.meta.env.VITE_GITHUB_REPO_LINK}>
					<Button variant="outline" className="gap-2">
						<GithubIcon />
						<span>os-chat</span>
					</Button>
				</CustomExternalLink>
			</div>

			<div className="space-y-3">
				<p className="text-muted-foreground text-sm">
					For bugs, features, or general inquiries:
				</p>
				<CustomExternalLink href={import.meta.env.VITE_X_URL}>
					<Button variant="outline" className="gap-2">
						<XIcon />
						<span>Contact</span>
					</Button>
				</CustomExternalLink>
			</div>
		</TabsContent>
	);
}
