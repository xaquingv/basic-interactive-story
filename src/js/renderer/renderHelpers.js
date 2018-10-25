const fs = require('fs');

function getTemplates(dir) {
    return fs.readdirSync("src/js/renderer/" + dir)
}

function loadTemplates(dir) {
	const templates = getTemplates(dir).map((name) => {
		return [name, fs.readFileSync("./src/js/renderer/" + dir + "/" + name).toString()];
	});

	const templatesObject = {};

	templates.forEach((template) => {
		templatesObject[template[0].replace(/.html/,"")] = template[1];
	});

	return templatesObject;
}

export const templates = loadTemplates('templates');

export function render(content, lang) {

	const css = fs.readFileSync("./build/main.css").toString();
	const meta = templates.meta;
	const nav = templates.nav;
	const page = templates.page.replace(/{{mainContent}}/, content).replace(/{{css}}/, css).replace(/{{meta}}/, meta);

	fs.writeFile(`build/index.html`, page, function (err) {
		console.log("Rendered");
	});

}
