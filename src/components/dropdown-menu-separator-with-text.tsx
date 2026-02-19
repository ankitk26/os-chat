import * as React from "react";

function DropdownMenuSeparatorWithText({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="my-2 flex items-center">
			<div className="border-border flex-1 border-t"></div>
			<span className="text-muted-foreground px-3 text-xs font-medium">
				{children}
			</span>
			<div className="border-border flex-1 border-t"></div>
		</div>
	);
}

export { DropdownMenuSeparatorWithText };
