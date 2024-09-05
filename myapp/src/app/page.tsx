import { Profile } from "@/components/Profile";

const Home = () => {
	return (
		<div className="custom_container flex flex-col items-center justify-center gap-4 md:h-dvh md:flex-row md:items-start md:justify-start md:gap-0 md:p-0">
			<aside className="md:h-dvh md:rounded-r-lg">
				<Profile />
			</aside>
			<main className="md:custom_container w-full md:h-dvh md:overflow-y-auto">
				Coming Soon...
			</main>
		</div>
	);
};

export default Home;
