import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { socialMedia } from "@/data/social-media";

const menuItems = [
	{
		href: "#about",
		value: "Sobre",
	},
	{
		href: "#experiences",
		value: "Experiências",
	},
	{
		href: "#projects",
		value: "Projetos",
	},
];

const socialMediaArray = [socialMedia.github, socialMedia.linkedin];

export const Profile = () => (
	<Card className="flex flex-col gap-2">
		<CardHeader>
			<CardTitle className="flex flex-col gap-2">
				<picture className="my-4 flex h-full w-full items-center justify-center">
					<Image
						src="/static/assets/profile.jpg"
						alt="Profile"
						width={768}
						height={768}
						className="h-64 w-64 rounded-full"
					/>
				</picture>
				<span>Alessandro Henrique Ramos</span>
				<span className="text-xl">Desenvolvedor Front-end</span>
			</CardTitle>
			<CardDescription>
				<span>
					Olá! Meu nome é Alessandro Henrique Ramos e eu sou um Desenvolvedor
					Front-end focado em TypeScript e React.
				</span>
			</CardDescription>
		</CardHeader>
		<CardContent className="flex flex-col gap-2">
			{menuItems.map(({ href, value }) => (
				<Button asChild key={value}>
					<Link href={href}>{value}</Link>
				</Button>
			))}
		</CardContent>
		<CardFooter className="flex gap-2">
			{socialMediaArray.map(({ href, name, icon }) => (
				<Button asChild key={name} variant="outline" size="icon">
					<Link href={href} aria-label={name} title={name}>
						<Icon name={icon} />
					</Link>
				</Button>
			))}
		</CardFooter>
	</Card>
);
