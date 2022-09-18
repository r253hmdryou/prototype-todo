import "normalize.css";
import { Router } from "@/Router";
import { Context } from "./Context";

export function App() {
	return (
		<Context>
			<Router />
		</Context>
	);
}
