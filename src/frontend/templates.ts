import Handlebars from "handlebars";
import type { HelperOptions } from "handlebars";
import config from "../config.ts";
const views = config.paths.views;
const partials = config.paths.partials;
export async function registerPartials(folderPath: string): Promise<void> {
	if (!folderPath.endsWith("/")) {
		folderPath += "/";
	}
	for await (const file of Deno.readDir(folderPath)) {
		const partialName = file.name.replace(".hbs", "");
		console.log(partialName);
		const partialPath = folderPath + file.name;
		const opened = await Deno.readTextFile(partialPath);
		Handlebars.registerPartial(partialName, opened);
	}
}

export function registerContent(): void {
	registerPartials(partials);
}

/**
 * Gets a view from a root filepath
 */
export async function viewFrom(
	path: string,
): Promise<HandlebarsTemplateDelegate<any>> {
	const opened = await Deno.readTextFile(path);
	return Handlebars.compile(opened);
}
export async function compiledView(
	path: `/${string}`,
	context = {},
): Promise<string> {
	return (await viewFrom(views + path))(context);
}
export async function view(
	path: `/${string}`,
): Promise<HandlebarsTemplateDelegate<unknown>> {
	return await viewFrom(views + path);
}
