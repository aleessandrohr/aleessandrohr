import { Experience } from "@/components/Experience";
import { Profile } from "@/components/Profile";
import { Project } from "@/components/Project";
import { experiences } from "@/data/experiences";
import { projects } from "@/data/projects";

const experiencesArray = [experiences.anuntech, experiences.techmmunity];
const projectsArray = [projects.letmeask, projects.techmmunityLandingPage];

const Home = () => {
	return (
		<div className="custom_container flex flex-col items-center justify-center gap-8 md:h-dvh md:flex-row md:items-start md:justify-start md:gap-0 md:p-0">
			<aside className="md:h-dvh md:rounded-r-lg">
				<Profile />
			</aside>
			<main className="flex w-full flex-col md:custom_container md:h-dvh md:overflow-y-auto md:py-0">
				<div className="relative flex w-full max-w-screen-sm flex-col gap-8 self-end">
					<section id="about" className="flex flex-col gap-4">
						<h2 className="custom_title sticky top-0 border-b border-solid border-border bg-background py-2">
							Sobre
						</h2>
						<p className="custom_description">
							Olá, me chamo Alessandro e atualmente crio aplicações web,
							principalmente com TypeScript, React e Next.js. Elas são sempre
							pensadas de modo que fiquem responsivas, performáticas, com um bom
							SEO e sempre acessíveis para qualquer tipo de usuário, além de
							claro, terem uma ótima arquitetura e estruturação durante o
							desenvolvimento do app. Por fim, ao mesmo tempo eu também busco
							sempre me aprimorar e aperfeiçoar os meus conhecimentos.
						</p>
					</section>
					<section id="experiences" className="flex flex-col gap-4">
						<h2 className="custom_title sticky top-0 border-b border-solid border-border bg-background py-2">
							Experiências
						</h2>
						{experiencesArray.map(({ subtitle, ...props }) => (
							<Experience key={subtitle} {...props} subtitle={subtitle} />
						))}
					</section>
					<section id="projects" className="flex flex-col gap-4">
						<h2 className="custom_title sticky top-0 border-b border-solid border-border bg-background py-2">
							Projetos
						</h2>
						{projectsArray.map(({ title, ...props }) => (
							<Project key={title} {...props} title={title} />
						))}
					</section>
				</div>
			</main>
		</div>
	);
};

export default Home;
