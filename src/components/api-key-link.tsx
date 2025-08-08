import ExternalLink from "./external-link";

type Props = {
  keyLink: string;
};

export default function ApiKeyLink(props: Props) {
  return (
    <small className="text-xs text-muted-foreground">
      Get your{" "}
      <ExternalLink
        href={props.keyLink}
        className="text-primary hover:underline"
      >
        API key
      </ExternalLink>
    </small>
  );
}
