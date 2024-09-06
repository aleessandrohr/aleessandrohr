import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Props {
	imageUrl: string;
	title: string;
	description: string;
	href: string;
}

export const Project = ({ imageUrl, title, description, href }: Props) => (
	<Card className="flex w-full flex-col gap-2 md:flex-row">
		<aside className="flex w-full flex-col justify-between gap-4 p-6 pb-0 md:max-w-64 md:pb-6">
			<div className="w-full">
				<Image
					src={imageUrl}
					width={500}
					height={500}
					alt={title}
					className="w-full rounded-lg"
				/>
			</div>
			<div className="w-full">
				<Dialog>
					<DialogTrigger className="w-full" asChild>
						<Button>Experimente clicando aqui!</Button>
					</DialogTrigger>
					<DialogContent className="h-[90dvh] max-h-[90dvh] w-[90dvw] max-w-[90dvw] rounded-lg">
						<div className="w-full p-2">
							<iframe
								src={href}
								title={title}
								className="h-full w-full rounded-lg"
								loading="lazy"
							/>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</aside>
		<section>
			<CardHeader>
				<CardTitle className="flex flex-col gap-1">
					<span className="text-xl">{title}</span>
				</CardTitle>
				<CardDescription className="custom_description">
					{description}
				</CardDescription>
				<CardFooter className="p-0 pt-2 text-sm text-secondary-foreground">
					<Link
						className="flex items-center justify-center gap-2"
						href={href}
						target="_blank"
					>
						<span className="underline">{href}</span>
						<Icon name="external-link" />
					</Link>
				</CardFooter>
			</CardHeader>
		</section>
	</Card>
);
