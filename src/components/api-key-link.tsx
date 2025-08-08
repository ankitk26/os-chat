import CustomExternalLink from "./custom-external-link";

type Props = {
  keyLink: string;
};

export default function ApiKeyLink(props: Props) {
  return (
    <small className="text-muted-foreground text-xs">
      Get your{" "}
      <CustomExternalLink
        className="text-primary hover:underline"
        href={props.keyLink}
      >
        API key
      </CustomExternalLink>
    </small>
  );
}
