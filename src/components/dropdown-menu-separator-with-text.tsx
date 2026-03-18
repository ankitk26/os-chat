import * as React from "react";

function DropdownMenuSeparatorWithText({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="my-2 flex items-center">
			<div className="flex-1 border-t border-border"></div>
			<span className="px-3 text-xs font-medium text-muted-foreground">
				{children}
			</span>
			<div className="flex-1 border-t border-border"></div>
		</div>
	);
}

export { DropdownMenuSeparatorWithText };
