import { PropsWithChildren } from "react";
import Auth from "./Auth";

export default function MeLayout({ children }: PropsWithChildren) {
	return <Auth>{children}</Auth>;
}
