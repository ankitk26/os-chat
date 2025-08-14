import CustomExternalLink from "./custom-external-link";
import GithubIcon from "./github-icon";
import { Button } from "./ui/button";
import { TabsContent } from "./ui/tabs";

export default function ContactSection() {
  return (
    <TabsContent
      className="space-y-6 rounded-xl border bg-card p-4 lg:p-8"
      value="about"
    >
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          This project is Open-Source.
        </p>
        <CustomExternalLink href="https://github.com/ankitk26/os-chat">
          <Button className="w-full lg:w-32">
            <GithubIcon />
            os-chat
          </Button>
        </CustomExternalLink>
      </div>

      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          For bugs, features, or general inquiries:
        </p>
        <CustomExternalLink href="https://x.com/akcejia">
          <Button className="w-full lg:w-32">
            <svg
              className="size-4 fill-primary-foreground"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>X</title>
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
            Contact
          </Button>
        </CustomExternalLink>
      </div>
    </TabsContent>
  );
}
