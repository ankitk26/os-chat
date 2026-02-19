import { Label } from "~/components/ui/label";
import type { Provider } from "~/types";
import ApiKeyInputForm from "./api-key-input-form";
import ApiKeyInputIcon from "./api-key-input-icon";
import ApiKeyLink from "./api-key-link";

type Props = {
	provider: Provider;
	keyLink: string;
	formValues: {
		label: string;
		placeholder?: string;
		value: string;
		onChange: (provider: Provider, value: string) => void;
	};
};

export default function ApiKeyInput(props: Props) {
	return (
		<div className="space-y-2">
			<Label className="text-muted-foreground">
				<div className="flex items-center space-x-2">
					<ApiKeyInputIcon provider={props.provider} />
					<span>{props.formValues.label}</span>
				</div>
			</Label>

			<ApiKeyInputForm
				formValues={props.formValues}
				provider={props.provider}
			/>

			<ApiKeyLink keyLink={props.keyLink} />
		</div>
	);
}
