import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface Props {
	children: ReactNode;
}

export const Loading = ({ children }: Props) => {
	return (
		<Button disabled>
			<Loader2 className="mr-2 h-4 w-4 animate-spin" />
			{children}
		</Button>
	);
};
