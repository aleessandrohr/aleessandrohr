import { Icon } from "@/components/Icon";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface Props {
	start: string;
	end: string;
	title: string;
	subtitle: string;
	description: string;
	techs: string;
}

export const Experience = ({
	start,
	end,
	title,
	subtitle,
	description,
}: Props) => (
	<Card className="flex w-full flex-col gap-2 md:flex-row">
		<aside className="flex p-6 pb-0 text-sm font-light">
			<div className="flex items-center justify-start self-start">
				<span>{start}</span>
				<Icon name="minus" />
				<span>{end}</span>
			</div>
		</aside>
		<section>
			<CardHeader>
				<CardTitle className="flex flex-col gap-1">
					<span className="text-xl">{title}</span>
					<span className="text-base">{subtitle}</span>
				</CardTitle>
				<CardDescription className="custom_description">
					{description}
				</CardDescription>
			</CardHeader>
		</section>
	</Card>
);
