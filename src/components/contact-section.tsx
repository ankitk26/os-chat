import ExternalLink from "./external-link";
import GithubIcon from "./github-icon";
import { Button } from "./ui/button";
import { TabsContent } from "./ui/tabs";

export default function ContactSection() {
  return (
    <TabsContent
      value="about"
      className="space-y-10 p-8 bg-card border rounded-xl"
    >
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          This project is Open-Source
        </p>
        <ExternalLink href="https://github.com/ankitk26/os-chat">
          <Button size="sm" className="w-32">
            <GithubIcon />
            os-chat
          </Button>
        </ExternalLink>
      </div>

      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Found any bug or want new features? Raise an issue in above repository
          or contact me below
        </p>

        <ExternalLink href="https://x.com/akcejia">
          <Button size="sm" className="w-32">
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 fill-primary-foreground"
            >
              <title>X</title>
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
            Contact
          </Button>
        </ExternalLink>
      </div>
    </TabsContent>
  );
}
